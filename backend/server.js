const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const db = require('./database');
const { validateQuizJSON } = require('./utils/validateQuizJSON');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// API 1: Validate JSON File
app.post('/api/admin/quiz/validate', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Check file extension (basic validation since frontend also handles it)
  if (!req.file.originalname.endsWith('.json')) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ errors: ['Only .json files are accepted'] });
  }

  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const jsonParsed = JSON.parse(fileContent);

    fs.unlinkSync(req.file.path); // remove physical file

    const validationResult = validateQuizJSON(jsonParsed);

    if (!validationResult.isValid) {
      return res.status(400).json({ errors: validationResult.errors, data: jsonParsed });
    }

    // Return the validated data for frontend preview
    return res.json({ success: true, data: jsonParsed });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ errors: ['Invalid JSON format. Could not parse file.'] });
  }
});

// API 2: Publish Quiz (save to DB)
app.post('/api/admin/quizzes', (req, res) => {
  const { title, category, difficulty, time_limit, pass_percent, show_explanation, questions } = req.body;
  if (!title || !questions || !questions.length) {
    return res.status(400).json({ error: 'Title and questions are required.' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const stmtQuiz = db.prepare(`
      INSERT INTO quizzes (title, category, difficulty, time_limit, pass_percent, show_explanation, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Live')
    `);

    stmtQuiz.run(
      [title, category || null, difficulty || 'easy', time_limit || 0, pass_percent || 50, show_explanation || 'after_quiz'],
      function (err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to create quiz' });
        }

        const quizId = this.lastID;
        const stmtQuestion = db.prepare(`
          INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const q of questions) {
          stmtQuestion.run([
            quizId,
            q.question,
            q.options.A,
            q.options.B,
            q.options.C,
            q.options.D,
            q.correct,
            q.explanation
          ]);
        }
        stmtQuestion.finalize();

        db.run('COMMIT', (commitErr) => {
          if (commitErr) {
            return res.status(500).json({ error: 'Transaction commit failed' });
          }
          res.json({ success: true, quizId, message: 'Quiz published successfully!' });
        });
      }
    );
    stmtQuiz.finalize();
  });
});

// API 3: Get all quizzes (Admin Dashboard)
app.get('/api/admin/quizzes', (req, res) => {
  db.all(`
    SELECT q.*, COUNT(qu.id) as questions_count 
    FROM quizzes q
    LEFT JOIN questions qu ON q.id = qu.quiz_id
    GROUP BY q.id
    ORDER BY q.created_at DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API 3.5: Get single quiz with full details (Admin Edit)
app.get('/api/admin/quizzes/:id', (req, res) => {
  const quizId = req.params.id;
  db.get("SELECT * FROM quizzes WHERE id = ?", [quizId], (err, quiz) => {
    if (err || !quiz) return res.status(404).json({ error: 'Quiz not found' });
    db.all("SELECT * FROM questions WHERE quiz_id = ?", [quizId], (err, questions) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...quiz, questions });
    });
  });
});

// API 4: Get User Quizzes
app.get('/api/quizzes', (req, res) => {
  db.all("SELECT * FROM quizzes WHERE status = 'Live' ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API 5: Get quiz questions for user (no correct_option/explanation)
app.get('/api/quizzes/:id/take', (req, res) => {
  const quizId = req.params.id;
  db.get("SELECT * FROM quizzes WHERE id = ?", [quizId], (err, quiz) => {
    if (err || !quiz) return res.status(404).json({ error: 'Quiz not found' });
    
    db.all("SELECT id, quiz_id, question_text, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ?", [quizId], (err, questions) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ quiz, questions });
    });
  });
});

// API 6: Submit attempt
app.post('/api/quizzes/:id/attempts', (req, res) => {
  const quizId = req.params.id;
  // answers object mapping question_id -> selected_option
  const { userId, answers, time_taken } = req.body; 

  db.all("SELECT * FROM questions WHERE quiz_id = ?", [quizId], (err, questions) => {
    if (err || !questions.length) return res.status(404).json({ error: 'Quiz missing questions' });

    let score = 0;
    const total = questions.length;
    const reviewData = [];

    const mappedQuestions = questions.reduce((acc, q) => {
      acc[q.id] = q;
      return acc;
    }, {});

    const answerKeys = Object.keys(answers || {});
    for (const qIdStr of answerKeys) {
      const qId = parseInt(qIdStr);
      const selected = answers[qIdStr];
      const q = mappedQuestions[qId];
      if (!q) continue;

      const isCorrect = q.correct_option === selected;
      if (isCorrect) score++;

      reviewData.push({
        question_id: qId,
        question_text: q.question_text,
        selected_option: selected,
        correct_option: q.correct_option,
        is_correct: isCorrect,
        explanation: q.explanation
      });
    }

    // Insert attempt
    db.run("INSERT INTO attempts (quiz_id, user_id, score, total, time_taken) VALUES (?, ?, ?, ?, ?)", [quizId, userId || 1, score, total, time_taken || 0], function(err) {
      if (err) return res.status(500).json({ error: 'Failed to record attempt' });
      const attemptId = this.lastID;

      // Note: we can optionally store each answer in the 'answers' table here
      
      res.json({ success: true, score, total, attemptId, review: reviewData });
    });
  });
});

// API 7: Delete Quiz
app.delete('/api/admin/quizzes/:id', (req, res) => {
  db.run("DELETE FROM quizzes WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// API 7.5: Update Quiz (Metadata + Questions)
app.put('/api/admin/quizzes/:id', (req, res) => {
  const quizId = req.params.id;
  const { title, category, difficulty, status, time_limit, pass_percent, questions } = req.body;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const sqlQuiz = `
      UPDATE quizzes 
      SET title = ?, category = ?, difficulty = ?, status = ?, time_limit = ?, pass_percent = ?
      WHERE id = ?
    `;
    db.run(sqlQuiz, [title, category, difficulty, status, time_limit, pass_percent, quizId], function(err) {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to update quiz metadata' });
      }

      // If no questions provided, just commit
      if (!questions) {
        db.run('COMMIT');
        return res.json({ success: true });
      }

      // Delete old questions
      db.run("DELETE FROM questions WHERE quiz_id = ?", [quizId], (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed' });
        }

        const stmtQuestion = db.prepare(`
          INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const q of questions) {
            // Note: handles both old format (from DB) and new format (from upload)
            stmtQuestion.run([
              quizId,
              q.question_text || q.question,
              q.option_a || q.options?.A,
              q.option_b || q.options?.B,
              q.option_c || q.options?.C,
              q.option_d || q.options?.D,
              q.correct_option || q.correct,
              q.explanation
            ]);
        }
        stmtQuestion.finalize();

        db.run('COMMIT', (err) => {
          if (err) return res.status(500).json({ error: 'Commit failed' });
          res.json({ success: true, message: 'Quiz updated fully' });
        });
      });
    });
  });
});


// API 8: Global Leaderboard
app.get('/api/leaderboard', (req, res) => {
  db.all(`
    SELECT a.id, a.user_id, a.score, a.total, a.completed_at, q.title as quiz_title
    FROM attempts a
    JOIN quizzes q ON a.quiz_id = q.id
    ORDER BY (CAST(a.score AS FLOAT) / a.total) DESC, a.completed_at DESC
    LIMIT 10
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API 9: Admin Analytics Stats
app.get('/api/admin/stats', (req, res) => {
  const stats = {};
  db.get("SELECT COUNT(*) as total_quizzes FROM quizzes", [], (err, row) => {
    stats.total_quizzes = row ? row.total_quizzes : 0;
    db.get("SELECT COUNT(*) as total_attempts, AVG(CAST(score AS FLOAT)/total)*100 as avg_score FROM attempts", [], (err, row2) => {
       stats.total_attempts = row2 ? row2.total_attempts : 0;
       stats.avg_score = row2 && row2.avg_score ? parseFloat(row2.avg_score).toFixed(1) : 0;
       res.json(stats);
    });
  });
});

// API 10: Get explicitly requested user's previous quiz attempts
app.get('/api/users/:id/attempts', (req, res) => {
  db.all(`
    SELECT a.*, q.title as quiz_title, q.category 
    FROM attempts a
    JOIN quizzes q ON a.quiz_id = q.id
    WHERE a.user_id = ?
    ORDER BY a.completed_at DESC
  `, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend server running on port " + PORT);
});

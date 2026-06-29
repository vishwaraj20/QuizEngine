const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const supabase = require('./database');
const { validateQuizJSON } = require('./utils/validateQuizJSON');
const { validateCodingJSON } = require('./utils/validateCodingJSON');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// API 1: Validate JSON File
app.post('/api/admin/quiz/validate', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Check file extension
  if (!req.file.originalname.endsWith('.json')) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ errors: ['Only .json files are accepted'] });
  }

  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const jsonParsed = JSON.parse(fileContent);
    fs.unlinkSync(req.file.path);

    const validationResult = validateQuizJSON(jsonParsed);
    if (!validationResult.isValid) {
      return res.status(400).json({ errors: validationResult.errors, data: jsonParsed });
    }
    return res.json({ success: true, data: jsonParsed });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ errors: ['Invalid JSON format. Could not parse file.'] });
  }
});

// API 2: Publish Quiz (save to DB)
app.post('/api/admin/quizzes', async (req, res) => {
  const { title, category, difficulty, time_limit, pass_percent, show_explanation, questions, phase, subject, year, quiz_mode, topic } = req.body;
  if (!title || !questions || !questions.length) {
    return res.status(400).json({ error: 'Title and questions are required.' });
  }

  const { data: quiz, error: quizError } = await supabase.from('quizzes').insert([{
    title,
    category: category || null,
    difficulty: difficulty || 'easy',
    time_limit: time_limit || 0,
    pass_percent: pass_percent || 50,
    show_explanation: show_explanation || 'after_quiz',
    status: 'Live',
    phase: phase || null,
    subject: subject || null,
    year: year || null,
    quiz_mode: quiz_mode || null,
    topic: topic || null
  }]).select().single();

  if (quizError) return res.status(500).json({ error: quizError.message });

  const formattedQuestions = questions.map(q => ({
    quiz_id: quiz.id,
    question_text: q.question,
    option_a: q.options.A,
    option_b: q.options.B,
    option_c: q.options.C,
    option_d: q.options.D,
    correct_option: q.correct,
    explanation: q.explanation
  }));

  const { error: qsError } = await supabase.from('questions').insert(formattedQuestions);
  
  if (qsError) {
    // Basic rollback by deleting the quiz
    await supabase.from('quizzes').delete().eq('id', quiz.id);
    return res.status(500).json({ error: qsError.message });
  }

  res.json({ success: true, quizId: quiz.id, message: 'Quiz published successfully!' });
});

// API 3: Get all quizzes (Admin Dashboard)
app.post('/api/admin/coding-problems/validate', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  if (!req.file.originalname.endsWith('.json')) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ errors: ['Only .json files are accepted'] });
  }

  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const jsonParsed = JSON.parse(fileContent);
    fs.unlinkSync(req.file.path);

    const validationResult = validateCodingJSON(jsonParsed);
    if (!validationResult.isValid) {
      return res.status(400).json({ errors: validationResult.errors, data: jsonParsed });
    }
    return res.json({ success: true, data: jsonParsed });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(400).json({ errors: ['Invalid JSON format. Could not parse file.'] });
  }
});

app.post('/api/admin/coding-problems', async (req, res) => {
  const { problems, company } = req.body;
  if (!problems || !problems.length) {
    return res.status(400).json({ error: 'Problems array is required.' });
  }

  const formattedProblems = problems.map(p => ({
    title: p.title,
    company: company || 'TCS',
    difficulty: p.difficulty || 'medium',
    description: p.description,
    starter_code: p.starter_code,
    test_cases: p.test_cases
  }));

  const { error } = await supabase.from('coding_problems').insert(formattedProblems);
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, message: 'Coding problems published successfully!' });
});

// API 4: Get all quizzes
app.get('/api/admin/quizzes', async (req, res) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, questions(count)')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  
  const rows = (data || []).map(q => ({
    ...q,
    questions_count: q.questions[0]?.count || 0
  }));
  res.json(rows);
});

// API 3.5: Get single quiz with full details (Admin Edit)
app.get('/api/admin/quizzes/:id', async (req, res) => {
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*, questions(*)')
    .eq('id', req.params.id)
    .single();

  if (quizError || !quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json(quiz);
});

// API 4: Get User Quizzes
app.get('/api/quizzes', async (req, res) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, questions(count)')
    .eq('status', 'Live')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  
  const rows = (data || []).map(q => ({
    ...q,
    questions_count: q.questions[0]?.count || 0
  }));
  res.json(rows);
});

// API 5: Get quiz questions for user (no correct_option/explanation)
app.get('/api/quizzes/:id/take', async (req, res) => {
  const { data: quiz, error: quizErr } = await supabase.from('quizzes').select('*').eq('id', req.params.id).single();
  if (quizErr || !quiz) return res.status(404).json({ error: 'Quiz not found' });
  
  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('id, quiz_id, question_text, option_a, option_b, option_c, option_d, difficulty')
    .eq('quiz_id', quiz.id)
    .order('id', { ascending: true });

  if (qErr) return res.status(500).json({ error: qErr.message });
  res.json({ quiz, questions: questions || [] });
});

// API 6: Submit attempt
app.post('/api/quizzes/:id/attempts', async (req, res) => {
  const quizId = req.params.id;
  const { userId, userName, answers, time_taken } = req.body; 

  const { data: questions, error } = await supabase.from('questions').select('*').eq('quiz_id', quizId).order('id', { ascending: true });
  if (error || !questions.length) return res.status(404).json({ error: 'Quiz missing questions' });

  let score = 0;
  const total = questions.length;
  const reviewData = [];

  for (const q of questions) {
    const selected = (answers || {})[q.id] || null;
    const isCorrect = selected !== null && q.correct_option === selected;
    if (isCorrect) score++;

    reviewData.push({
      question_id: q.id,
      question_text: q.question_text,
      selected_option: selected,
      correct_option: q.correct_option,
      is_correct: isCorrect,
      explanation: q.explanation
    });
  }

  const { data: attempt, error: attemptErr } = await supabase.from('attempts').insert([{
    quiz_id: quizId,
    user_id: userId || 'Unknown',
    user_name: userName || 'Unknown',
    score,
    total,
    time_taken: time_taken || 0
  }]).select().single();

  if (attemptErr) return res.status(500).json({ error: 'Failed to record attempt' });

  res.json({ success: true, score, total, attemptId: attempt.id, review: reviewData });
});

// API 7: Delete Quiz
app.delete('/api/admin/quizzes/:id', async (req, res) => {
  const { error } = await supabase.from('quizzes').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// API 7.5: Update Quiz (Metadata + Questions)
app.put('/api/admin/quizzes/:id', async (req, res) => {
  const quizId = req.params.id;
  const { title, category, difficulty, status, time_limit, pass_percent, show_explanation, questions, phase, subject, year, quiz_mode, topic } = req.body;

  const { error: quizError } = await supabase.from('quizzes').update({
    title, category, difficulty, status, time_limit, pass_percent, show_explanation, phase, subject, year, quiz_mode, topic
  }).eq('id', quizId);

  if (quizError) return res.status(500).json({ error: 'Failed to update quiz metadata' });

  if (!questions) {
    return res.json({ success: true });
  }

  // Delete old questions
  await supabase.from('questions').delete().eq('quiz_id', quizId);

  const formattedQuestions = questions.map(q => ({
    quiz_id: quizId,
    question_text: q.question_text || q.question,
    option_a: q.option_a || q.options?.A,
    option_b: q.option_b || q.options?.B,
    option_c: q.option_c || q.options?.C,
    option_d: q.option_d || q.options?.D,
    correct_option: q.correct_option || q.correct,
    explanation: q.explanation
  }));

  const { error: qsError } = await supabase.from('questions').insert(formattedQuestions);
  if (qsError) return res.status(500).json({ error: 'Failed to save new questions' });

  res.json({ success: true, message: 'Quiz updated fully' });
});

// API 8: Global Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  const { data, error } = await supabase.from('attempts').select('*, quizzes(title, category)');
  if (error) return res.status(500).json({ error: error.message });

  // Custom sort since calculating dynamic columns in Supabase requires an RPC
  const sorted = data.sort((a,b) => (b.score/b.total) - (a.score/a.total)).slice(0, 10);
  
  const rows = sorted.map(a => ({
    id: a.id, 
    user_id: a.user_id, 
    user_name: a.user_name, 
    score: a.score, 
    total: a.total, 
    completed_at: a.completed_at, 
    quiz_title: a.quizzes?.title, 
    category: a.quizzes?.category
  }));
  res.json(rows);
});

// API 9: Admin Analytics Stats
app.get('/api/admin/stats', async (req, res) => {
  const { count: total_quizzes } = await supabase.from('quizzes').select('*', { count: 'exact', head: true });
  const { data: attempts } = await supabase.from('attempts').select('score, total');
  
  const total_attempts = attempts ? attempts.length : 0;
  let avg = 0;
  if (total_attempts > 0) {
    avg = attempts.reduce((acc, a) => acc + (a.score / a.total) * 100, 0) / total_attempts;
  }
  
  res.json({ 
    total_quizzes: total_quizzes || 0, 
    total_attempts, 
    avg_score: avg.toFixed(1) 
  });
});

// API 10: Get explicitly requested user's previous quiz attempts
app.get('/api/users/:id/attempts', async (req, res) => {
  const { data, error } = await supabase
    .from('attempts')
    .select('*, quizzes(title, category)')
    .eq('user_id', req.params.id)
    .order('completed_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const rows = data.map(a => ({
    ...a,
    quiz_title: a.quizzes?.title,
    category: a.quizzes?.category
  }));
  res.json(rows);
});

// API 11: Get all coding problems for a company
app.get('/api/coding-problems/company/:company', async (req, res) => {
  const { data, error } = await supabase
    .from('coding_problems')
    .select('id, title, difficulty')
    .eq('company', req.params.company)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// API 12: Get specific coding problem
app.get('/api/coding-problems/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('coding_problems')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Problem not found' });
  res.json(data);
});

// API 13: Execute Code (Proxy to Paiza.io)
app.post('/api/execute', async (req, res) => {
  const { code, language, input } = req.body;
  const paizaLang = language === 'python' ? 'python3' : language;
  
  try {
    const createRes = await fetch('https://api.paiza.io/runners/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language: paizaLang,
        input: input || '',
        api_key: 'guest'
      })
    });
    
    const createData = await createRes.json();
    if (!createData.id) {
      return res.status(400).json({ error: createData.error || 'Failed to start execution' });
    }

    // Poll for details
    let details;
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const detailRes = await fetch(`https://api.paiza.io/runners/get_details?id=${createData.id}&api_key=guest`);
      details = await detailRes.json();
      if (details.status === 'completed') {
        break;
      }
    }

    if (details?.status === 'completed') {
      const errorOut = (details.build_stderr || '') + (details.stderr || '');
      const output = errorOut ? errorOut + (details.stdout || '') : (details.stdout || 'Code executed successfully with no output.');
      return res.json({ output });
    } else {
      return res.status(504).json({ error: 'Execution timed out or failed.' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Execution server error: ' + err.message });
  }
});

// API 14: Submit Code against test cases
app.post('/api/submit', async (req, res) => {
  const { code, language, problem_id } = req.body;
  const paizaLang = language === 'python' ? 'python3' : language;
  
  try {
    // 1. Fetch test cases from database
    const { data: problem, error } = await supabase
      .from('coding_problems')
      .select('test_cases')
      .eq('id', problem_id)
      .single();

    if (error || !problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    const testCases = problem.test_cases || [];
    if (testCases.length === 0) {
      return res.status(400).json({ error: 'No test cases available for this problem.' });
    }

    // 2. Execute code against each test case in parallel
    const runPromises = testCases.map(async (tc, index) => {
      try {
        const createRes = await fetch('https://api.paiza.io/runners/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source_code: code,
            language: paizaLang,
            input: tc.input || '',
            api_key: 'guest'
          })
        });
        
        const createData = await createRes.json();
        if (!createData.id) return { status: 'Error starting execution' };

        let details;
        for (let i = 0; i < 15; i++) {
          await new Promise(r => setTimeout(r, 1000));
          const detailRes = await fetch(`https://api.paiza.io/runners/get_details?id=${createData.id}&api_key=guest`);
          details = await detailRes.json();
          if (details.status === 'completed') break;
        }

        if (details?.status === 'completed') {
          const errorOut = (details.build_stderr || '') + (details.stderr || '');
          const output = errorOut ? errorOut + (details.stdout || '') : (details.stdout || '');
          const actualOutput = output.trim();
          const expectedOutput = (tc.expected_output || '').trim();
          
          return {
            testCase: index + 1,
            input: tc.input,
            expectedOutput,
            actualOutput,
            passed: actualOutput === expectedOutput && !errorOut,
            error: !!errorOut
          };
        } else {
          return { testCase: index + 1, passed: false, error: true, actualOutput: 'Timeout or execution failed.' };
        }
      } catch (e) {
        return { testCase: index + 1, passed: false, error: true, actualOutput: e.message };
      }
    });

    const results = await Promise.all(runPromises);
    const allPassed = results.every(r => r.passed);
    
    return res.json({ success: true, allPassed, results });
  } catch (err) {
    return res.status(500).json({ error: 'Submit execution error: ' + err.message });
  }
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend server running on port " + PORT + " using Supabase Postgres");
});

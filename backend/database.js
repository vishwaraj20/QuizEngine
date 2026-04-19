const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'quizapp.db');
const db = new sqlite3.Database(dbPath);

function initDB() {
  db.run("PRAGMA foreign_keys = ON;");
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT,
        difficulty TEXT DEFAULT 'easy',
        time_limit INTEGER DEFAULT 0,
        pass_percent INTEGER DEFAULT 50,
        show_explanation TEXT DEFAULT 'after_quiz',
        status TEXT DEFAULT 'Draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration: add difficulty column if it doesn't exist (for existing DBs)
    db.run(`ALTER TABLE quizzes ADD COLUMN difficulty TEXT DEFAULT 'easy'`, () => {});

    db.run(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER,
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_option TEXT NOT NULL,
        explanation TEXT,
        difficulty TEXT,
        FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER,
        user_id INTEGER,
        score INTEGER DEFAULT 0,
        total INTEGER DEFAULT 0,
        time_taken INTEGER DEFAULT 0,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attempt_id INTEGER,
        question_id INTEGER,
        selected_option TEXT,
        is_correct BOOLEAN,
        FOREIGN KEY(attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
        FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE
      )
    `);
  });
}

initDB();

module.exports = db;

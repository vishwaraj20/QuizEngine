// Mock database using local SQLite to allow offline run on localhost
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'quiz_app.db');
const db = new sqlite3.Database(dbPath);

// Create tables synchronously on startup
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
  
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option TEXT NOT NULL,
      explanation TEXT,
      difficulty TEXT
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
      user_id TEXT,
      user_name TEXT,
      score INTEGER DEFAULT 0,
      total INTEGER DEFAULT 0,
      time_taken INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Promisify SQLite methods
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Fluent query builder mocking Supabase Client API
class SupabaseQueryBuilder {
  constructor(table) {
    this.table = table;
    this._select = '*';
    this._eq = [];
    this._order = null;
    this._limit = null;
    this._single = false;
    this._insertData = null;
    this._updateData = null;
    this._delete = false;
    this._countOnly = false;
  }
  
  select(cols = '*', options = {}) {
    this._select = cols;
    if (options.count === 'exact' && options.head === true) {
      this._countOnly = true;
    }
    return this;
  }
  
  eq(column, value) {
    this._eq.push({ column, value });
    return this;
  }
  
  order(column, options) {
    this._order = { column, ascending: options?.ascending !== false };
    return this;
  }
  
  limit(n) {
    this._limit = n;
    return this;
  }
  
  single() {
    this._single = true;
    return this;
  }
  
  insert(data) {
    this._insertData = data;
    return this;
  }
  
  update(data) {
    this._updateData = data;
    return this;
  }
  
  delete() {
    this._delete = true;
    return this;
  }
  
  // Await support
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
  
  async execute() {
    try {
      if (this._insertData) {
        return await this.executeInsert();
      }
      if (this._updateData) {
        return await this.executeUpdate();
      }
      if (this._delete) {
        return await this.executeDelete();
      }
      return await this.executeSelect();
    } catch (err) {
      console.error(`SQLite Mock Error on table ${this.table}:`, err);
      return { data: null, error: err, count: 0 };
    }
  }
  
  async executeInsert() {
    const isArray = Array.isArray(this._insertData);
    const rows = isArray ? this._insertData : [this._insertData];
    const insertedRows = [];
    
    for (const row of rows) {
      const keys = Object.keys(row);
      const cols = keys.join(', ');
      const placeholders = keys.map(() => '?').join(', ');
      const vals = keys.map(k => row[k]);
      
      const sql = `INSERT INTO ${this.table} (${cols}) VALUES (${placeholders})`;
      const result = await run(sql, vals);
      
      const inserted = await get(`SELECT * FROM ${this.table} WHERE id = ?`, [result.lastID]);
      insertedRows.push(inserted);
    }
    
    const data = this._single ? (insertedRows[0] || null) : (isArray ? insertedRows : insertedRows[0]);
    return { data, error: null };
  }
  
  async executeUpdate() {
    const keys = Object.keys(this._updateData);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const vals = keys.map(k => this._updateData[k]);
    
    let sql = `UPDATE ${this.table} SET ${setClause}`;
    const whereVals = [];
    if (this._eq.length > 0) {
      const whereClause = this._eq.map(e => {
        whereVals.push(e.value);
        return `${e.column} = ?`;
      }).join(' AND ');
      sql += ` WHERE ${whereClause}`;
    }
    
    await run(sql, [...vals, ...whereVals]);
    return { data: null, error: null };
  }
  
  async executeDelete() {
    let sql = `DELETE FROM ${this.table}`;
    const whereVals = [];
    if (this._eq.length > 0) {
      const whereClause = this._eq.map(e => {
        whereVals.push(e.value);
        return `${e.column} = ?`;
      }).join(' AND ');
      sql += ` WHERE ${whereClause}`;
    }
    await run(sql, whereVals);
    return { data: null, error: null };
  }
  
  async executeSelect() {
    if (this._countOnly) {
      let sql = `SELECT COUNT(*) as count FROM ${this.table}`;
      const whereVals = [];
      if (this._eq.length > 0) {
        const whereClause = this._eq.map(e => {
          whereVals.push(e.value);
          return `${e.column} = ?`;
        }).join(' AND ');
        sql += ` WHERE ${whereClause}`;
      }
      const row = await get(sql, whereVals);
      return { count: row.count, data: null, error: null };
    }
    
    const isJoinQuestionsCount = this._select.includes('questions(count)');
    const isJoinQuestionsAll = this._select.includes('questions(*)');
    const isJoinQuizzes = this._select.includes('quizzes(');
    
    let sql = `SELECT * FROM ${this.table}`;
    const whereVals = [];
    if (this._eq.length > 0) {
      const whereClause = this._eq.map(e => {
        whereVals.push(e.value);
        return `${e.column} = ?`;
      }).join(' AND ');
      sql += ` WHERE ${whereClause}`;
    }
    
    if (this._order) {
      sql += ` ORDER BY ${this._order.column} ${this._order.ascending ? 'ASC' : 'DESC'}`;
    }
    
    if (this._limit) {
      sql += ` LIMIT ${this._limit}`;
    }
    
    const rows = await all(sql, whereVals);
    const formattedRows = [];
    
    for (const row of rows) {
      const formatted = { ...row };
      
      if (isJoinQuestionsCount) {
        const qCount = await get(`SELECT COUNT(*) as count FROM questions WHERE quiz_id = ?`, [row.id]);
        formatted.questions = [{ count: qCount.count }];
      }
      
      if (isJoinQuestionsAll) {
        const questions = await all(`SELECT * FROM questions WHERE quiz_id = ?`, [row.id]);
        formatted.questions = questions;
      }
      
      if (isJoinQuizzes && row.quiz_id) {
        const quiz = await get(`SELECT title, category FROM quizzes WHERE id = ?`, [row.quiz_id]);
        formatted.quizzes = quiz || null;
      }
      
      formattedRows.push(formatted);
    }
    
    const data = this._single ? (formattedRows[0] || null) : formattedRows;
    return { data, error: null };
  }
}

const supabase = {
  from: (table) => {
    return new SupabaseQueryBuilder(table);
  }
};

module.exports = supabase;

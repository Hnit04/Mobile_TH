
import * as SQLite from 'expo-sqlite';
import { ExpenseType } from '../types/expense'; 

const db = SQLite.openDatabaseSync('expenses.db');

const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL, 
        type TEXT NOT NULL CHECK(type IN ('thu', 'chi')),
        date TEXT NOT NULL,
        isDeleted INTEGER DEFAULT 0
      );
    `);
    console.log('Database and table initialized successfully (sync)');
  } catch (error) {
    console.error('Error initializing table: ', error);
    throw error;
  }
};

export { db, initDatabase };
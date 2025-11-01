// src/db/database.ts
import * as SQLite from 'expo-sqlite';
import dayjs from 'dayjs'; 
import { Expense, ExpenseInput } from '../types/expense'; 

const db = SQLite.openDatabaseSync('expenses.db');

export const initDatabase = () => {
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

//cau 3
/**
 * Thêm một khoản thu/chi mới vào database
 */
export const addExpense = (expense: ExpenseInput) => {
  console.log('Adding expense:', expense.title);
  try {
    const date = dayjs().toISOString();

    db.runSync(
      'INSERT INTO expenses (title, amount, type, date) VALUES (?, ?, ?, ?)',
      [expense.title, expense.amount, expense.type, date]
    );
    console.log('Expense added successfully');
  } catch (error) {
    console.error('Error adding expense: ', error);
  }
};


export const getAllExpenses = (): Expense[] => {
  try {
 
    const expenses = db.getAllSync<Expense>(
      'SELECT * FROM expenses WHERE isDeleted = 0 ORDER BY date DESC'
    );
    return expenses;
  } catch (error) {
    console.error('Error fetching expenses: ', error);
    return []; 
  }
};


export { db };
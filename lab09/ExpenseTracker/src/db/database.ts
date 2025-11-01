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
//cau 4
export const getExpenseById = (id: number): Expense | null => {
  try {
    // Dùng getFirstSync<Expense> để lấy 1 dòng
    const expense = db.getFirstSync<Expense>(
      'SELECT * FROM expenses WHERE id = ?',
      [id]
    );
    return expense || null;
  } catch (error) {
    console.error(`Error fetching expense with id ${id}: `, error);
    return null;
  }
};

/**
 * Cập nhật một khoản thu/chi
 */

export const updateExpense = (id: number, expense: ExpenseInput) => {
  console.log('Updating expense:', id);
  try {
    db.runSync(
      'UPDATE expenses SET title = ?, amount = ?, type = ? WHERE id = ?',
      [expense.title, expense.amount, expense.type, id]
    );
    console.log('Expense updated successfully');
  } catch (error) {
    console.error(`Error updating expense with id ${id}: `, error);
  }
};

export { db };
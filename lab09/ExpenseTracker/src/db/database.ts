// src/db/database.ts
import * as SQLite from 'expo-sqlite';
import dayjs from 'dayjs'; 
import { Expense, ExpenseInput, ExpenseType } from '../types/expense';
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



//cau 4
export const getExpenseById = (id: number): Expense | null => {
  try {
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
//cau05
export const softDeleteExpense = (id: number) => {
  console.log('Soft deleting expense:', id);
  try {
    db.runSync(
      'UPDATE expenses SET isDeleted = 1 WHERE id = ?',
      [id]
    );
    console.log('Expense soft deleted successfully');
  } catch (error) {
    console.error(`Error soft deleting expense with id ${id}: `, error);
  }
};

export const getDeletedExpenses = (): Expense[] => {
  try {
    const expenses = db.getAllSync<Expense>(
      'SELECT * FROM expenses WHERE isDeleted = 1 ORDER BY date DESC'
    );
    return expenses;
  } catch (error) {
    console.error('Error fetching deleted expenses: ', error);
    return [];
  }
};

//cau 06
export const searchActiveExpenses = (query: string): Expense[] => {
  try {
    const expenses = db.getAllSync<Expense>(
      'SELECT * FROM expenses WHERE isDeleted = 0 AND title LIKE ?',
      [`%${query}%`]
    );
    return expenses;
  } catch (error) {
    console.error('Error searching active expenses: ', error);
    return [];
  }
};

export const searchDeletedExpenses = (query: string): Expense[] => {
  try {
    const expenses = db.getAllSync<Expense>(
      'SELECT * FROM expenses WHERE isDeleted = 1 AND title LIKE ?',
      [`%${query}%`]
    );
    return expenses;
  } catch (error) {
    console.error('Error searching deleted expenses: ', error);
    return [];
  }
};

//cau 08
export const restoreExpense = (id: number) => {
  console.log('Restoring expense:', id);
  try {
    db.runSync(
      'UPDATE expenses SET isDeleted = 0 WHERE id = ?',
      [id]
    );
    console.log('Expense restored successfully');
  } catch (error) {
    console.error(`Error restoring expense with id ${id}: `, error);
  }
};
//cau 10
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

export const getAndFilterExpenses = (
  query: string,
  filter: 'tat_ca' | 'thu' | 'chi'
): Expense[] => {
  console.log(`Querying DB with filter: ${filter}, query: ${query}`);
  try {
    // Xây dựng câu lệnh SQL
    let sql = 'SELECT * FROM expenses WHERE isDeleted = 0';
    const params: (string | number)[] = [];

    // 1. Lọc theo Tìm kiếm (Câu 6)
    if (query.trim() !== '') {
      sql += ' AND title LIKE ?';
      params.push(`%${query}%`);
    }

    // 2. Lọc theo Loại (Câu 10)
    if (filter !== 'tat_ca') {
      sql += ' AND type = ?';
      params.push(filter);
    }

    // 3. Sắp xếp
    sql += ' ORDER BY date DESC';

    // Thực thi
    const expenses = db.getAllSync<Expense>(sql, params);
    return expenses;
  } catch (error) {
    console.error('Error fetching and filtering expenses: ', error);
    return [];
  }
};
//cau 11
export interface MonthlyStat {
  month: string; // Định dạng 'YYYY-MM'
  totalThu: number;
  totalChi: number;
}

export const getMonthlyStats = (): MonthlyStat[] => {
  try {
    const stats = db.getAllSync<MonthlyStat>(`
      SELECT
        strftime('%Y-%m', date) AS month,
        SUM(CASE WHEN type = 'thu' THEN amount ELSE 0 END) AS totalThu,
        SUM(CASE WHEN type = 'chi' THEN amount ELSE 0 END) AS totalChi
      FROM expenses
      WHERE isDeleted = 0
      GROUP BY month
      ORDER BY month DESC
    `);
    

    return stats.filter(s => s.totalThu > 0 || s.totalChi > 0);

  } catch (error) {
    console.error('Error fetching monthly stats: ', error);
    return [];
  }
};
export { db };
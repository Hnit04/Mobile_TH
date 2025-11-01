// src/types/expense.ts

// Định nghĩa loại Thu/Chi
export type ExpenseType = 'thu' | 'chi';

// Cấu trúc của một khoản Thu/Chi
export interface Expense {
  id: number;
  title: string;
  amount: number;
  type: ExpenseType;
  date: string;
  isDeleted: number; 
}

export type ExpenseInput = Pick<Expense, 'title' | 'amount' | 'type'>;
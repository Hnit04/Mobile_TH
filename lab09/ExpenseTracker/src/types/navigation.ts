
import { ExpenseType } from './expense';

// Định nghĩa các màn hình
export type RootStackParamList = {
  HomeScreen: undefined;
  ExpenseDetailScreen: { expenseId?: number };
  TrashScreen: undefined;
  StatisticsScreen: undefined;
  SyncScreen: undefined;
};
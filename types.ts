
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export interface DailySummary {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export type ViewType = 'DASHBOARD' | 'TRANSACTIONS' | 'SETTINGS' | 'ADD';

export interface AppTheme {
  isDark: boolean;
}

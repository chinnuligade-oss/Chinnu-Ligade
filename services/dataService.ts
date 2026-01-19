
import { Transaction, TransactionType, DailySummary } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';

export const generateMockData = (days: number = 60): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Some days have income (e.g., bi-weekly)
    if (i % 15 === 0) {
      transactions.push({
        id: `inc-${i}`,
        date: dateStr,
        amount: 2500 + Math.random() * 500,
        category: 'Salary',
        type: TransactionType.INCOME,
        description: 'Monthly Salary Credit'
      });
    }

    // Daily expenses
    const numExpenses = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < numExpenses; j++) {
      const category = EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)];
      transactions.push({
        id: `exp-${i}-${j}`,
        date: dateStr,
        amount: Math.random() * 100 + 10,
        category,
        type: TransactionType.EXPENSE,
        description: `${category} purchase`
      });
    }
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getDailySummaries = (transactions: Transaction[]): DailySummary[] => {
  const map = new Map<string, DailySummary>();

  transactions.forEach(t => {
    const existing = map.get(t.date) || { date: t.date, income: 0, expense: 0, balance: 0 };
    if (t.type === TransactionType.INCOME) {
      existing.income += t.amount;
    } else {
      existing.expense += t.amount;
    }
    existing.balance = existing.income - existing.expense;
    map.set(t.date, existing);
  });

  return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getCategoryStats = (transactions: Transaction[], type: TransactionType) => {
  const stats: Record<string, number> = {};
  transactions.filter(t => t.type === type).forEach(t => {
    stats[t.category] = (stats[t.category] || 0) + t.amount;
  });
  return Object.entries(stats).map(([name, value]) => ({ name, value }));
};

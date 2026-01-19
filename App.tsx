
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import { Transaction, TransactionType, ViewType, AppTheme } from './types';
import { generateMockData, getDailySummaries, getCategoryStats } from './services/dataService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from './constants';
import { 
  SpendingAreaChart, 
  CategoryDonutChart, 
  IncomePieChart, 
  BalanceLineChart, 
  WeeklyBarChart, 
  SavingsRateGauge 
} from './components/Charts';
import { getFinancialAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('DASHBOARD');
  const [theme, setTheme] = useState<AppTheme>({ isDark: true });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    category: EXPENSE_CATEGORIES[0],
    type: TransactionType.EXPENSE,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const data = generateMockData(60);
    setTransactions(data);
  }, []);

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
    
    return {
      totalIncome,
      totalExpense,
      balance,
      savingsRate,
      daily: getDailySummaries(transactions),
      expenseCategories: getCategoryStats(transactions, TransactionType.EXPENSE),
      incomeCategories: getCategoryStats(transactions, TransactionType.INCOME)
    };
  }, [transactions]);

  const handleToggleTheme = () => setTheme(prev => ({ isDark: !prev.isDark }));

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount))) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: Number(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description || 'No description',
      date: formData.date
    };

    setTransactions([newTransaction, ...transactions]);
    setFormData({
      amount: '',
      category: EXPENSE_CATEGORIES[0],
      type: TransactionType.EXPENSE,
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setActiveView('DASHBOARD');
  };

  const handleGetAiAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getFinancialAdvice({
      totalIncome: stats.totalIncome,
      totalExpense: stats.totalExpense,
      balance: stats.balance,
      topExpenseCategory: stats.expenseCategories[0]?.name
    });
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  return (
    <Layout activeView={activeView} setView={setActiveView} theme={theme} toggleTheme={handleToggleTheme}>
      {activeView === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard title="Current Balance" value={stats.balance} icon="💰" color="text-indigo-500" isDark={theme.isDark} />
            <SummaryCard title="Total Revenue" value={stats.totalIncome} icon="📈" color="text-emerald-500" isDark={theme.isDark} />
            <SummaryCard title="Total Outflow" value={stats.totalExpense} icon="📉" color="text-rose-500" isDark={theme.isDark} />
            <SummaryCard title="Active Savings" value={stats.savingsRate} isPercent icon="🏦" color="text-blue-500" isDark={theme.isDark} />
          </div>

          {/* AI Banner */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 items-center ${theme.isDark ? 'bg-indigo-950/30 border-indigo-900/50' : 'bg-indigo-50 border-indigo-200'}`}>
            <div className="text-3xl">🤖</div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">FinVue Intelligence</h4>
              {aiAdvice ? (
                <p className="text-sm opacity-90 leading-relaxed whitespace-pre-wrap">{aiAdvice}</p>
              ) : (
                <p className="text-sm opacity-70 italic">Click "Analyze Wealth" for personalized financial guidance powered by Gemini.</p>
              )}
            </div>
            <button 
              onClick={handleGetAiAdvice}
              disabled={isAiLoading}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
                isAiLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
              }`}
            >
              {isAiLoading ? 'Analyzing...' : 'Analyze Wealth'}
            </button>
          </div>

          {/* 3x3 Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <SpendingAreaChart data={stats.daily} isDark={theme.isDark} />
             <CategoryDonutChart data={stats.expenseCategories} isDark={theme.isDark} />
             <IncomePieChart data={stats.incomeCategories} isDark={theme.isDark} />
             
             <BalanceLineChart data={stats.daily} isDark={theme.isDark} />
             <WeeklyBarChart data={stats.daily} isDark={theme.isDark} />
             <SavingsRateGauge rate={stats.savingsRate} isDark={theme.isDark} />

             {/* Placeholder for more granular analytics */}
             <div className={`p-6 rounded-2xl border flex flex-col justify-center items-center text-center ${theme.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-bold">Monthly Target</h3>
                <p className="text-sm text-slate-500 mt-2">You are 85% towards your $5,000 savings goal this month.</p>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[85%]" />
                </div>
             </div>

             <div className={`p-6 rounded-2xl border flex flex-col justify-center items-center text-center ${theme.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="text-4xl mb-4">📆</div>
                <h3 className="font-bold">Next Bill Due</h3>
                <p className="text-sm text-slate-500 mt-2">Rent & Utilities ($1,850.00) due in 4 days.</p>
                <button className="mt-4 text-xs font-bold text-indigo-500 underline uppercase tracking-tighter">View Calendar</button>
             </div>

             <div className={`p-6 rounded-2xl border flex flex-col justify-center items-center text-center ${theme.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="font-bold">Fiscal Score</h3>
                <div className="text-3xl font-black text-emerald-500 mt-2">785</div>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Excellent</p>
             </div>
          </div>
        </div>
      )}

      {activeView === 'TRANSACTIONS' && (
        <div className={`rounded-2xl border overflow-hidden ${theme.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <table className="w-full text-left">
            <thead className={`text-xs uppercase tracking-wider text-slate-500 ${theme.isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <tr>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Description</th>
                <th className="px-6 py-4 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      t.type === TransactionType.INCOME 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm opacity-80">{t.description}</td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeView === 'ADD' && (
        <div className="max-w-xl mx-auto">
          <div className={`p-8 rounded-2xl border ${theme.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
            <h2 className="text-2xl font-bold mb-6">Record Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-6">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: TransactionType.EXPENSE, category: EXPENSE_CATEGORIES[0]})}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === TransactionType.EXPENSE ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-50'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: TransactionType.INCOME, category: INCOME_CATEGORIES[0]})}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === TransactionType.INCOME ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-50'}`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Amount</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">$</span>
                   <input
                    required
                    type="number"
                    step="0.01"
                    className={`w-full bg-transparent border-2 rounded-xl py-3 pl-10 pr-4 text-2xl font-bold focus:border-indigo-500 outline-none ${theme.isDark ? 'border-slate-800' : 'border-slate-200'}`}
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Category</label>
                  <select
                    className={`w-full bg-transparent border-2 rounded-xl p-3 outline-none ${theme.isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {(formData.type === TransactionType.EXPENSE ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Date</label>
                  <input
                    type="date"
                    className={`w-full bg-transparent border-2 rounded-xl p-3 outline-none ${theme.isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Description</label>
                <input
                  type="text"
                  className={`w-full bg-transparent border-2 rounded-xl p-3 outline-none ${theme.isDark ? 'border-slate-800' : 'border-slate-200'}`}
                  placeholder="What was this for?"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20"
              >
                Log Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {activeView === 'SETTINGS' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className={`p-8 rounded-2xl border ${theme.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h2 className="text-xl font-bold mb-6">Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Dark Mode</h4>
                  <p className="text-sm text-slate-500">Toggle the application visual theme.</p>
                </div>
                <button 
                  onClick={handleToggleTheme}
                  className={`w-14 h-8 rounded-full relative transition-all ${theme.isDark ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${theme.isDark ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Currency</h4>
                  <p className="text-sm text-slate-500">Primary display currency for the dashboard.</p>
                </div>
                <select className={`p-2 rounded-lg border bg-transparent ${theme.isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <button className="text-rose-500 font-bold hover:underline">Clear Local Cache & Reset Data</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const SummaryCard = ({ title, value, icon, color, isDark, isPercent }: { title: string, value: number, icon: string, color: string, isDark: boolean, isPercent?: boolean }) => (
  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</span>
      <span className="text-xl">{icon}</span>
    </div>
    <p className={`text-2xl font-black ${color}`}>
      {isPercent ? `${value.toFixed(1)}%` : `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
    </p>
  </div>
);

export default App;

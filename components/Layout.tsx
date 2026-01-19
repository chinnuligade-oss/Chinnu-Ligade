
import React from 'react';
import { ViewType, AppTheme } from '../types';
import { MOCK_USER } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setView: (view: ViewType) => void;
  theme: AppTheme;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, theme, toggleTheme }) => {
  const isDark = theme.isDark;

  const NavItem = ({ view, label, icon }: { view: ViewType, label: string, icon: string }) => {
    const active = activeView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${
          active 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r hidden md:flex flex-col ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">V</div>
            <span className="text-2xl font-bold tracking-tight">FinVue</span>
          </div>

          <nav className="space-y-2">
            <NavItem view="DASHBOARD" label="Overview" icon="📊" />
            <NavItem view="TRANSACTIONS" label="Transactions" icon="📝" />
            <NavItem view="ADD" label="Add Entry" icon="➕" />
            <NavItem view="SETTINGS" label="Settings" icon="⚙️" />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img src={MOCK_USER.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{MOCK_USER.name}</p>
              <p className="text-xs text-slate-500 truncate">{MOCK_USER.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className={`h-16 border-b px-6 flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h1 className="text-lg font-bold">
            {activeView === 'DASHBOARD' && 'Financial Insights'}
            {activeView === 'TRANSACTIONS' && 'History Log'}
            {activeView === 'ADD' && 'New Transaction'}
            {activeView === 'SETTINGS' && 'System Settings'}
          </h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <div className="md:hidden">
               <button className="text-2xl">☰</button>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <section className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;

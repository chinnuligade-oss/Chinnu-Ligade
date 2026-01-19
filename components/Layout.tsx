
import React, { useState } from 'react';
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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
    setCopyStatus('idle');
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }).catch(() => {
      // Fallback for browsers with restricted clipboard access
      const input = document.getElementById('share-url-input') as HTMLInputElement;
      if (input) {
        input.select();
        input.setSelectionRange(0, 99999);
        document.execCommand('copy');
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
      }
    });
  };

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
      <aside className={`w-64 border-r hidden md:flex flex-col no-print ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
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
        <header className={`h-16 border-b px-6 flex items-center justify-between shrink-0 no-print ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h1 className="text-lg font-bold">
            {activeView === 'DASHBOARD' && 'Financial Insights'}
            {activeView === 'TRANSACTIONS' && 'History Log'}
            {activeView === 'ADD' && 'New Transaction'}
            {activeView === 'SETTINGS' && 'System Settings'}
          </h1>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={handleShare}
              title="Share Review Link"
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
              🔗
            </button>
            <button 
              onClick={handlePrint}
              title="Print to PDF"
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            >
              🖨️
            </button>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Viewport */}
        <section className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Share Dashboard</h2>
              <button onClick={() => setIsShareModalOpen(false)} className="text-2xl leading-none opacity-50 hover:opacity-100">&times;</button>
            </div>
            <p className="text-sm text-slate-500 mb-6">Send this link to others so they can review your dashboard properly.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <input 
                  id="share-url-input"
                  readOnly
                  type="text"
                  value={window.location.href}
                  className={`w-full p-3 pr-24 rounded-xl border-2 text-sm font-mono focus:outline-none ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                />
                <button 
                  onClick={copyToClipboard}
                  className={`absolute right-2 top-1.5 px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    copyStatus === 'copied' 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {copyStatus === 'copied' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center">If the button doesn't work, manually copy the text above.</p>
            </div>
            
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="mt-6 w-full py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:opacity-80 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;

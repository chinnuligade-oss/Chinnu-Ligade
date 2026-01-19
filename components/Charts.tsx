
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { CATEGORY_COLORS } from '../constants';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  isDark: boolean;
}

const ChartCard: React.FC<ChartContainerProps> = ({ title, children, isDark }) => (
  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
    <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">{title}</h3>
    <div className="h-64 w-full">
      {children}
    </div>
  </div>
);

export const SpendingAreaChart = ({ data, isDark }: { data: any[], isDark: boolean }) => (
  <ChartCard title="Cash Flow Trend (Last 30 Days)" isDark={isDark}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data.slice(-30)}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
        <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
        <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} />
        <Tooltip 
          contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', border: 'none', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
        />
        <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
        <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </ChartCard>
);

export const CategoryDonutChart = ({ data, isDark }: { data: any[], isDark: boolean }) => {
  const COLORS = Object.values(CATEGORY_COLORS);
  return (
    <ChartCard title="Expenses by Category" isDark={isDark}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', border: 'none', borderRadius: '8px' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const IncomePieChart = ({ data, isDark }: { data: any[], isDark: boolean }) => {
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
  return (
    <ChartCard title="Income Sources" isDark={isDark}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            outerRadius={80}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', border: 'none', borderRadius: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export const BalanceLineChart = ({ data, isDark }: { data: any[], isDark: boolean }) => (
  <ChartCard title="Cumulative Net Balance" isDark={isDark}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
        <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} hide />
        <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} />
        <Tooltip 
          contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', border: 'none', borderRadius: '8px' }}
        />
        <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </ChartCard>
);

export const WeeklyBarChart = ({ data, isDark }: { data: any[], isDark: boolean }) => (
  <ChartCard title="Average Weekly Burn" isDark={isDark}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.slice(-7)}>
        <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} tickFormatter={(val) => val.split('-')[2]} />
        <Tooltip 
          contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', border: 'none', borderRadius: '8px' }}
        />
        <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);

export const SavingsRateGauge = ({ rate, isDark }: { rate: number, isDark: boolean }) => {
  const data = [
    { name: 'Savings', value: rate },
    { name: 'Spending', value: 100 - rate }
  ];
  const COLORS = ['#6366f1', '#e2e8f0'];
  return (
    <ChartCard title="Savings Rate (%)" isDark={isDark}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : (isDark ? '#334155' : '#f1f5f9')} />
            ))}
          </Pie>
          <text x="50%" y="80%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-2xl font-bold" fill={isDark ? 'white' : 'black'}>
            {Math.round(rate)}%
          </text>
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import SalesCard from './SalesCard';
import { useAuth } from '../contexts/AuthContext';
import FieldChart from './FieldChart';

const API_BASE = 'https://dashboard-98ck.onrender.com/api/v1/users';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
const years = ['2022', '2023', '2024'];

// Mock data for charts
const revenueVsExpenses = [
  { name: 'Jan', Revenue: 80000, Expenses: 60000 },
  { name: 'Feb', Revenue: 95000, Expenses: 70000 },
  { name: 'Mar', Revenue: 70000, Expenses: 65000 },
  { name: 'Apr', Revenue: 110000, Expenses: 90000 },
  { name: 'May', Revenue: 120000, Expenses: 95000 },
  { name: 'Jun', Revenue: 90000, Expenses: 80000 },
];
const monthlyTrends = [
  { name: 'Jan', value: 20000 },
  { name: 'Feb', value: 25000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 20000 },
  { name: 'May', value: 25000 },
  { name: 'Jun', value: 10000 },
];
const budgetAllocation = [
  { name: 'Salaries', value: 35000 },
  { name: 'Rent', value: 12000 },
  { name: 'Utilities', value: 5000 },
  { name: 'Marketing', value: 8000 },
  { name: 'Supplies', value: 4000 },
  { name: 'Other', value: 6000 },
];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

const Financial = () => {
  const { user } = useAuth();
  const [saleHistory, setSaleHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetch(`${API_BASE}/sale/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.saleHistory) && data.saleHistory.length > 0) {
            setSaleHistory(data.saleHistory);
          } else {
            setSaleHistory([]);
          }
        })
        .catch(() => setSaleHistory([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Find latest totalExpenses and netProfit from saleHistory
  const latestTotalExpenses = saleHistory.length > 0 ? [...saleHistory].sort((a, b) => new Date(b.date) - new Date(a.date))[0].totalExpenses ?? 0 : 0;
  const latestNetProfit = saleHistory.length > 0 ? [...saleHistory].sort((a, b) => new Date(b.date) - new Date(a.date))[0].netProfit ?? 0 : 0;

  const stats = [
    { label: 'Total Expenses', value: loading ? 'Loading...' : `$${latestTotalExpenses.toLocaleString()}` },
    { label: 'Net Profit', value: loading ? 'Loading...' : `$${latestNetProfit.toLocaleString()}` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      <SalesCard />
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8 flex flex-col items-center text-center border border-white/20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Financial Dashboard</h1>
          <p className="text-purple-200 text-base sm:text-lg mb-2">Track your financial performance and key metrics</p>
          <p className="text-gray-300 text-sm sm:text-base">Monitor expenses, profit, and ROI in a beautiful dashboard.</p>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 sm:p-6 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white flex flex-col items-center"
            >
              <div className="text-xl sm:text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm sm:text-md font-medium tracking-wide uppercase text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Total Expenses & Net Profit Chart */}
        <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 mb-8">
          <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Total Expenses & Net Profit Trend</h2>
          <FieldChart history={saleHistory} dataKey="totalExpenses" color="#ef4444" label="Total Expenses" />
          <FieldChart history={saleHistory} dataKey="netProfit" color="#10b981" label="Net Profit" />
        </div>
      </div>
    </div>
  );
};

export default Financial; 
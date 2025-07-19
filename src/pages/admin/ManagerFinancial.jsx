import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import SaleChart from '../SaleChart';
import FieldChart from '../FieldChart';

const API_BASE = 'https://dashboard-98ck.onrender.com/api/v1/users';

const stats = [
  { label: 'Total Expenses', value: '$850,000' },
  { label: 'Net Profit', value: '$350,000' },
  { label: 'Cash Flow', value: '$120,000' },
  { label: 'ROI', value: '8.2%' },
];

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

const ManagerFinancial = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [latestSale, setLatestSale] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saleHistory, setSaleHistory] = useState([]);

  useEffect(() => {
    const fetchLatestSale = async () => {
      try {
        const usersRes = await axios.get(`${API_BASE}/all`);
        if (usersRes.data.success) {
          const users = usersRes.data.users.filter(u => u.role === 'admin');
          let latestSaleValue = 0;
          let latestSaleDate = null;
          let allSales = [];
          for (const user of users) {
            try {
              const saleRes = await axios.get(`${API_BASE}/sale/${user._id}`);
              if (saleRes.data.success && saleRes.data.saleHistory && saleRes.data.saleHistory.length > 0) {
                allSales = allSales.concat(saleRes.data.saleHistory);
                const userLatest = saleRes.data.saleHistory.reduce((latest, curr) => new Date(curr.date) > new Date(latest.date) ? curr : latest);
                if (!latestSaleDate || new Date(userLatest.date) > new Date(latestSaleDate)) {
                  latestSaleValue = userLatest.value;
                  latestSaleDate = userLatest.date;
                }
              }
            } catch (error) { /* skip user */ }
          }
          setLatestSale(latestSaleValue);
          setSaleHistory(allSales);
          // Debug: print saleHistory to check values
          console.log('saleHistory:', allSales);
        }
      } catch (error) {
        setLatestSale(0);
        setSaleHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestSale();
  }, []);

  // Find latest totalExpenses and netProfit from saleHistory
  const latestTotalExpenses = saleHistory.length > 0 ? [...saleHistory].sort((a, b) => new Date(b.date) - new Date(a.date))[0].totalExpenses ?? 0 : 0;
  const latestNetProfit = saleHistory.length > 0 ? [...saleHistory].sort((a, b) => new Date(b.date) - new Date(a.date))[0].netProfit ?? 0 : 0;

  const allStats = [
    { label: 'Total Expenses', value: loading ? 'Loading...' : `$${latestTotalExpenses.toLocaleString()}` },
    { label: 'Net Profit', value: loading ? 'Loading...' : `$${latestNetProfit.toLocaleString()}` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8 flex flex-col items-center text-center border border-white/20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Manager Financial Dashboard</h1>
          <p className="text-purple-200 text-base sm:text-lg mb-2">Track aggregated financial performance and key metrics</p>
          <p className="text-gray-300 text-sm sm:text-base">Monitor expenses, profit, ROI, and total sales across all users.</p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-6 sm:mb-8">
          <select
            className="rounded-lg px-3 py-2 sm:px-4 sm:py-2 bg-white/20 text-white border border-white/30 focus:outline-none"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            className="rounded-lg px-3 py-2 sm:px-4 sm:py-2 bg-white/20 text-white border border-white/30 focus:outline-none"
            value={selectedQuarter}
            onChange={e => setSelectedQuarter(e.target.value)}
          >
            <option value="">All Quarters</option>
            {quarters.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          <select
            className="rounded-lg px-3 py-2 sm:px-4 sm:py-2 bg-white/20 text-white border border-white/30 focus:outline-none"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {allStats.map((stat) => (
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
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[...saleHistory].sort((a, b) => new Date(a.date) - new Date(b.date))} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={date => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={date => new Date(date).toLocaleString()} />
              <Bar dataKey="totalExpenses" name="Total Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
              <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Sale Chart */}
        <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 mb-8">
          <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Sales History (All Admins)</h2>
          <SaleChart history={saleHistory} />
        </div>
        {/* Charts */}
        {/* Remove extra charts for this view */}
      </div>
    </div>
  );
};

export default ManagerFinancial; 
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import SaleChart from './SaleChart';

const API_BASE = 'https://dashboard-98ck.onrender.com/api/v1/users';

const assetsLiabilities = [
  { name: 'Jan', Assets: 50000, Liabilities: 20000 },
  { name: 'Feb', Assets: 60000, Liabilities: 25000 },
  { name: 'Mar', Assets: 55000, Liabilities: 22000 },
  { name: 'Apr', Assets: 70000, Liabilities: 30000 },
  { name: 'May', Assets: 80000, Liabilities: 35000 },
  { name: 'Jun', Assets: 75000, Liabilities: 32000 },
];
const cashFlow = [
  { name: 'Jan', Cash: 12000 },
  { name: 'Feb', Cash: 15000 },
  { name: 'Mar', Cash: 10000 },
  { name: 'Apr', Cash: 18000 },
  { name: 'May', Cash: 20000 },
  { name: 'Jun', Cash: 17000 },
];
const transactions = [
  { date: '2024-06-01', desc: 'Invoice #123', amount: '+$2,000', type: 'Credit' },
  { date: '2024-06-02', desc: 'Payment to Vendor', amount: '-$1,200', type: 'Debit' },
  { date: '2024-06-03', desc: 'Invoice #124', amount: '+$3,500', type: 'Credit' },
  { date: '2024-06-04', desc: 'Office Supplies', amount: '-$400', type: 'Debit' },
  { date: '2024-06-05', desc: 'Invoice #125', amount: '+$1,800', type: 'Credit' },
];

const Accounting = () => {
  const { user } = useAuth();
  const [latestSale, setLatestSale] = useState('...');
  const [saleHistory, setSaleHistory] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetch(`${API_BASE}/sale/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.saleHistory) && data.saleHistory.length > 0) {
            const sorted = [...data.saleHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
            setLatestSale(sorted[0].value);
            setSaleHistory(data.saleHistory);
          } else {
            setLatestSale(0);
            setSaleHistory([]);
          }
        })
        .catch(() => {
          setLatestSale(0);
          setSaleHistory([]);
        });
    }
  }, [user]);

  const stats = [
    { label: 'Invoices', value: '1,200' },
    { label: 'Receivables', value: '$95,000' },
    { label: 'Payables', value: '$60,000' },
    { label: 'Balance', value: '$35,000' },
    { label: 'Sales', value: latestSale },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 flex flex-col items-center text-center border border-white/20">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Accounting Dashboard</h1>
          <p className="text-yellow-200 text-lg mb-2">Accounting at a glance</p>
          <p className="text-gray-300">View invoices, receivables, payables, and balances in a modern dashboard.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-6 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white flex flex-col items-center"
            >
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-md font-medium tracking-wide uppercase text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Sale Chart */}
        <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Sales History</h2>
          <SaleChart history={saleHistory} />
        </div>
        {/* Stacked Bar Chart: Assets & Liabilities */}
        <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Assets & Liabilities</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={assetsLiabilities} stackOffset="sign">
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Assets" stackId="a" fill="#82ca9d" />
              <Bar dataKey="Liabilities" stackId="a" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Area Chart: Cash Flow */}
        <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Cash Flow</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Cash" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Transactions Table */}
        <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-white rounded-xl overflow-hidden shadow-lg text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="bg-[#F6E27A]/80 text-[#1a2a33]">
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}>
                    <td className="px-2 sm:px-4 py-2 font-medium">{txn.date}</td>
                    <td className="px-2 sm:px-4 py-2">{txn.desc}</td>
                    <td className="px-2 sm:px-4 py-2">{txn.amount}</td>
                    <td className="px-2 sm:px-4 py-2">{txn.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounting; 
import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import SaleChart from './SaleChart';

const API_BASE = 'https://dashboard-98ck.onrender.com/api/v1/users';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

const userActivity = [
  { name: 'Jan', users: 1200 },
  { name: 'Feb', users: 1500 },
  { name: 'Mar', users: 1800 },
  { name: 'Apr', users: 2100 },
  { name: 'May', users: 2500 },
  { name: 'Jun', users: 3245 },
];
const deptDistribution = [
  { name: 'Engineering', value: 40 },
  { name: 'HR', value: 10 },
  { name: 'Finance', value: 15 },
  { name: 'Commercial', value: 20 },
  { name: 'Support', value: 15 },
];

const Overview = () => {
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
    { label: 'Total Revenue', value: '$1,200,000' },
    { label: 'Active Users', value: '3,245' },
    { label: 'Projects', value: '27' },
    { label: 'Growth', value: '+12.5%' },
    { label: 'Sales', value: latestSale },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Welcome Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8 flex flex-col items-center text-center border border-white/20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg uppercase">dash vp engenharia</h1>
          <p className="text-blue-200 text-base sm:text-lg mb-2">Your advanced overview at a glance</p>
          <p className="text-gray-300 text-sm sm:text-base">Track your business performance, users, and growth in one beautiful place.</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-10">
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
        {/* Sale Chart */}
        <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 mb-8">
          <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Sales History</h2>
          <SaleChart history={saleHistory} />
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Line Chart: User Activity */}
          <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">User Activity Over Time</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Pie Chart: Department Distribution */}
          <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Department Distribution</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={deptDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {deptDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 
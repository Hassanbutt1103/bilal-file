import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import SaleChart from '../SaleChart';

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

const ManagerOverview = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saleHistory, setSaleHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all users
        const usersRes = await axios.get(`${API_BASE}/all`);
        if (usersRes.data.success) {
          const users = usersRes.data.users;
          setTotalUsers(users.length);

          let latestSaleValue = 0;
          let latestSaleDate = null;
          let allSales = [];

          // Fetch sales for each admin user
          for (const user of users.filter(u => u.role === 'admin')) {
            try {
              const saleRes = await axios.get(`${API_BASE}/sale/${user._id}`);
              if (saleRes.data.success && saleRes.data.saleHistory && saleRes.data.saleHistory.length > 0) {
                allSales = allSales.concat(saleRes.data.saleHistory);
                // Find the most recent sale in this user's history
                const userLatest = saleRes.data.saleHistory.reduce((latest, curr) => new Date(curr.date) > new Date(latest.date) ? curr : latest);
                if (!latestSaleDate || new Date(userLatest.date) > new Date(latestSaleDate)) {
                  latestSaleValue = userLatest.value;
                  latestSaleDate = userLatest.date;
                }
              }
            } catch (error) {
              // skip user
            }
          }
          setTotalSales(latestSaleValue);
          setSaleHistory(allSales);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `$${totalSales.toFixed(2)}` },
    { label: 'Active Users', value: totalUsers.toString() },
    { label: 'Projects', value: '27' },
    { label: 'Growth', value: '+12.5%' },
    { label: 'Latest Sale', value: `$${totalSales.toFixed(2)}` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Welcome Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8 flex flex-col items-center text-center border border-white/20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Manager Overview Dashboard</h1>
          <p className="text-blue-200 text-base sm:text-lg mb-2">Aggregated business performance and sales overview</p>
          <p className="text-gray-300 text-sm sm:text-base">Track total sales, users, and growth across all departments.</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 sm:p-6 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white flex flex-col items-center"
            >
              <div className="text-xl sm:text-2xl font-bold mb-2">{loading ? 'Loading...' : stat.value}</div>
              <div className="text-sm sm:text-md font-medium tracking-wide uppercase text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Sale Chart */}
        <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 mb-8">
          <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Sales History (All Admins)</h2>
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

export default ManagerOverview; 
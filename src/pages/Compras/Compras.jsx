import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Total Purchases', value: '320' },
  { label: 'Vendors', value: '18' },
  { label: 'Monthly Spend', value: '$45,000' },
  { label: 'Open Orders', value: '12' },
];

const purchasesByCategory = [
  { name: 'Office Supplies', value: 80 },
  { name: 'Equipment', value: 60 },
  { name: 'Raw Materials', value: 120 },
  { name: 'Services', value: 40 },
  { name: 'Other', value: 20 },
];
const vendorsDistribution = [
  { name: 'Vendor A', value: 5 },
  { name: 'Vendor B', value: 3 },
  { name: 'Vendor C', value: 4 },
  { name: 'Vendor D', value: 2 },
  { name: 'Other', value: 4 },
];
const monthlySpend = [
  { name: 'Jan', spend: 6000 },
  { name: 'Feb', spend: 7000 },
  { name: 'Mar', spend: 8000 },
  { name: 'Apr', spend: 9000 },
  { name: 'May', spend: 8000 },
  { name: 'Jun', spend: 7000 },
];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

const Compras = () => (
  <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8 flex flex-col items-center text-center border border-white/20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Compras Dashboard</h1>
        <p className="text-yellow-200 text-base sm:text-lg mb-2">Procurement & Purchasing Overview</p>
        <p className="text-gray-300 text-sm sm:text-base">Track purchases, vendors, and spending trends for better procurement management.</p>
      </div>
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
      {/* Bar Chart: Purchases by Category */}
      <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Purchases by Category</h2>
        <p className="text-gray-300 text-sm sm:text-base mb-2">See how purchases are distributed across categories.</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={purchasesByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Pie Chart: Vendors Distribution */}
      <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Vendors Distribution</h2>
        <p className="text-gray-300 text-sm sm:text-base mb-2">Analyze vendor engagement and diversity.</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={vendorsDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {vendorsDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Line Chart: Monthly Spend */}
      <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Monthly Spend</h2>
        <p className="text-gray-300 text-sm sm:text-base mb-2">Track how much is spent each month on purchases.</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlySpend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="spend" stroke="#00C49F" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default Compras; 
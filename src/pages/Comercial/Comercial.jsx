import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Deals Closed', value: '32' },
  { label: 'Revenue', value: '$210,000' },
  { label: 'New Leads', value: '58' },
  { label: 'Conversion Rate', value: '18%' },
];

// Mock data
const salesByProduct = [
  { name: 'Product A', sales: 120 },
  { name: 'Product B', sales: 90 },
  { name: 'Product C', sales: 60 },
  { name: 'Product D', sales: 30 },
];
const customerTypes = [
  { name: 'Retail', value: 60 },
  { name: 'Wholesale', value: 25 },
  { name: 'Online', value: 15 },
];
const monthlySales = [
  { name: 'Jan', sales: 15000 },
  { name: 'Feb', sales: 18000 },
  { name: 'Mar', sales: 22000 },
  { name: 'Apr', sales: 20000 },
  { name: 'May', sales: 25000 },
  { name: 'Jun', sales: 27000 },
];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const Comercial = () => (
  <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8 flex flex-col items-center text-center border border-white/20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Commercial Dashboard</h1>
        <p className="text-yellow-200 text-base sm:text-lg mb-2">Commercial KPIs</p>
        <p className="text-gray-300 text-sm sm:text-base">Track deals, leads, and revenue in a modern dashboard.</p>
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
      {/* Bar Chart: Sales by Product */}
      <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Sales by Product</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={salesByProduct}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Pie Chart: Customer Types/Regions */}
      <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Customer Types</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={customerTypes}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {customerTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Line Chart: Monthly Sales Trends */}
      <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Monthly Sales Trends</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#82ca9d" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default Comercial; 
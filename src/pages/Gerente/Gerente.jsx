import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Teams', value: '5' },
  { label: 'Projects', value: '12' },
  { label: 'Pending Approvals', value: '7' },
  { label: 'Completed Tasks', value: '320' },
];

const teamPerformance = [
  { name: 'Team A', score: 85 },
  { name: 'Team B', score: 78 },
  { name: 'Team C', score: 92 },
  { name: 'Team D', score: 70 },
  { name: 'Team E', score: 88 },
];
const projectStatus = [
  { name: 'On Track', value: 7 },
  { name: 'At Risk', value: 3 },
  { name: 'Delayed', value: 2 },
];
const approvalsOverTime = [
  { name: 'Jan', approvals: 10 },
  { name: 'Feb', approvals: 15 },
  { name: 'Mar', approvals: 12 },
  { name: 'Apr', approvals: 18 },
  { name: 'May', approvals: 20 },
  { name: 'Jun', approvals: 22 },
];
const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Gerente = () => (
  <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 flex flex-col items-center text-center border border-white/20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Gerente Dashboard</h1>
        <p className="text-yellow-200 text-lg mb-2">Managerial Overview & Team Performance</p>
        <p className="text-gray-300">Monitor team performance, project status, and approval trends for effective management.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
      {/* Bar Chart: Team Performance */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
        <h2 className="text-lg font-bold text-white mb-2">Team Performance</h2>
        <p className="text-gray-300 mb-2">Compare performance scores across teams.</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={teamPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Pie Chart: Project Status */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
        <h2 className="text-lg font-bold text-white mb-2">Project Status</h2>
        <p className="text-gray-300 mb-2">See the current status of all projects.</p>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={projectStatus}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {projectStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Line Chart: Approvals Over Time */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
        <h2 className="text-lg font-bold text-white mb-2">Approvals Over Time</h2>
        <p className="text-gray-300 mb-2">Track how many approvals were made each month.</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={approvalsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="approvals" stroke="#8884d8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default Gerente; 
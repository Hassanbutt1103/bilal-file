import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Active Projects', value: '12' },
  { label: 'Engineers', value: '48' },
  { label: 'Tickets', value: '134' },
  { label: 'Deployments', value: '22' },
];

// Mock data
const projectProgress = [
  { name: 'Week 1', progress: 10 },
  { name: 'Week 2', progress: 30 },
  { name: 'Week 3', progress: 55 },
  { name: 'Week 4', progress: 80 },
  { name: 'Week 5', progress: 100 },
];
const issueCounts = [
  { name: 'Alice', issues: 12 },
  { name: 'Bob', issues: 8 },
  { name: 'Carlos', issues: 15 },
  { name: 'Diana', issues: 6 },
];
const systemLoad = 72; // percent

const Gauge = ({ value }) => {
  // Simple SVG gauge
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#444"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#00C49F"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="1.5em"
        fill="#fff"
        fontWeight="bold"
      >
        {percent}%
      </text>
    </svg>
  );
};

const Engenharia = () => (
  <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 flex flex-col items-center text-center border border-white/20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Engineering Dashboard</h1>
        <p className="text-blue-200 text-lg mb-2">Engineering KPIs</p>
        <p className="text-gray-300">Monitor projects, engineers, and deployments in a modern dashboard.</p>
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
      {/* Gauge Chart: System Load/Uptime */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8 flex flex-col items-center">
        <h2 className="text-lg font-bold text-white mb-4">System Load</h2>
        <Gauge value={systemLoad} />
      </div>
      {/* Line Chart: Project Progress */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Project Progress Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={projectProgress}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="progress" stroke="#8884d8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Bar Chart: Issue Counts by Engineer */}
      <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Issue Counts by Engineer</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={issueCounts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="issues" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default Engenharia; 
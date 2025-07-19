import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const FieldChart = ({ history = [], dataKey, color = '#3b82f6', label = '' }) => {
  if (!Array.isArray(history) || history.length === 0) {
    return <div className="text-center text-gray-400">No data to display.</div>;
  }
  // Oldest to latest (left to right)
  const chartData = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="w-full mt-4">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={date => new Date(date).toLocaleDateString()} />
          <YAxis />
          <Tooltip labelFormatter={date => new Date(date).toLocaleString()} />
          <Bar dataKey={dataKey} name={label} fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-2 mt-2 text-xs">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: color }}></span> {label}</span>
      </div>
    </div>
  );
};

export default FieldChart; 
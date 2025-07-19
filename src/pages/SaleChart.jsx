import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const SaleChart = ({ history = [] }) => {
  if (!Array.isArray(history) || history.length === 0) {
    return <div className="text-center text-gray-400">No sales to display.</div>;
  }
  // Oldest to latest (left to right)
  const chartData = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  const maxValue = Math.max(...chartData.map(e => e.value));
  const minValue = Math.min(...chartData.map(e => e.value));
  const latestIdx = chartData.length - 1;
  const maxIdx = chartData.findIndex(e => e.value === maxValue);
  const minIdx = chartData.findIndex(e => e.value === minValue);

  return (
    <div className="w-full mt-6">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={date => new Date(date).toLocaleDateString()} />
          <YAxis />
          <Tooltip labelFormatter={date => new Date(date).toLocaleString()} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false} fill="#94a3b8">
            {chartData.map((entry, idx) => {
              let color = '#94a3b8'; // gray for normal bars
              if (idx === latestIdx) color = '#3b82f6'; // blue for latest
              else if (idx === maxIdx) color = '#10b981'; // green for max
              else if (idx === minIdx) color = '#ef4444'; // red for min
              return <Cell key={`cell-${idx}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-blue-500"></span> Latest</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-500"></span> Max</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-500"></span> Min</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-gray-400"></span> Other</span>
      </div>
    </div>
  );
};

export default SaleChart; 
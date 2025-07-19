import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const API_BASE = 'https://dashboard-98ck.onrender.com/api/v1/users';

function downloadCSV(data) {
  const header = 'Sale Value,Date/Time\n';
  const rows = data.map(entry => `${entry.value},"${new Date(entry.date).toLocaleString()}"`).join('\n');
  const csvContent = header + rows;
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'svc-sales.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const SVCDashboard = () => {
  const { user } = useAuth();
  const [saleHistory, setSaleHistory] = useState([]); // array of {value, date, totalExpenses, netProfit, revenue}
  const [inputSale, setInputSale] = useState('');
  const [inputTotalExpenses, setInputTotalExpenses] = useState('');
  const [inputNetProfit, setInputNetProfit] = useState('');
  const [inputRevenue, setInputRevenue] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?._id) {
      fetch(`${API_BASE}/sale/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSaleHistory(Array.isArray(data.saleHistory) ? data.saleHistory : []);
            setInputSale('');
          }
        });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!inputSale || isNaN(Number(inputSale))) {
      setMessage('Please enter a valid sale number.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/sale/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sale: Number(inputSale),
          totalExpenses: inputTotalExpenses ? Number(inputTotalExpenses) : 0,
          netProfit: inputNetProfit ? Number(inputNetProfit) : 0,
          revenue: inputRevenue ? Number(inputRevenue) : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaleHistory(Array.isArray(data.saleHistory) ? data.saleHistory : []);
        setMessage('Sale updated successfully!');
        setInputSale('');
        setInputTotalExpenses('');
        setInputNetProfit('');
        setInputRevenue('');
      } else {
        setMessage(data.message || 'Failed to update sale');
      }
    } catch (err) {
      setMessage('Error updating sale');
    } finally {
      setLoading(false);
    }
  };

  // Sort sale history: latest first
  const sortedHistory = [...saleHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestSale = sortedHistory.length > 0 ? sortedHistory[0].value : 0;
  // For chart: oldest to latest (left to right)
  const chartData = [...sortedHistory].reverse();

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-900 drop-shadow-lg tracking-wide">SVC Dashboard</h1>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Sales Input</h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-6 mb-10 items-center w-full">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <span className="font-medium text-lg">User:</span>
            <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-lg font-semibold shadow">{user?.userName || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
            <div className="flex flex-col">
              <label htmlFor="saleInput" className="text-blue-700 font-semibold mb-1">Sale</label>
              <input
                id="saleInput"
                type="number"
                value={inputSale}
                min={0}
                onChange={e => setInputSale(e.target.value)}
                placeholder="Enter sale number"
                className="border-2 border-blue-300 rounded-lg px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300 shadow-sm text-black"
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-blue-700 font-semibold mb-1">Total Expenses</label>
              <input
                type="number"
                value={inputTotalExpenses}
                min={0}
                onChange={e => setInputTotalExpenses(e.target.value)}
                placeholder="Total Expenses"
                className="border-2 border-blue-300 rounded-lg px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300 shadow-sm text-black"
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-blue-700 font-semibold mb-1">Net Profit</label>
              <input
                type="number"
                value={inputNetProfit}
                min={0}
                onChange={e => setInputNetProfit(e.target.value)}
                placeholder="Net Profit"
                className="border-2 border-blue-300 rounded-lg px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300 shadow-sm text-black"
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-blue-700 font-semibold mb-1">Revenue</label>
              <input
                type="number"
                value={inputRevenue}
                min={0}
                onChange={e => setInputRevenue(e.target.value)}
                placeholder="Revenue"
                className="border-2 border-blue-300 rounded-lg px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300 shadow-sm text-black"
                autoComplete="off"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 transition text-lg mt-2"
            disabled={loading || inputSale === ''}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
        <div className="text-green-600 font-medium min-h-[24px] text-center mb-4 transition-all duration-300">{message}</div>
        <div className="mt-4 text-gray-700 text-lg text-center">
          <span className="font-semibold text-blue-700">Current Sale:</span> <span className="font-bold text-blue-900 text-2xl">{latestSale}</span>
        </div>
        <div className="mt-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-blue-700 text-lg text-center">Sale History</h3>
            <button
              onClick={() => downloadCSV(sortedHistory)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all border border-blue-700"
            >
              Download Sales
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl shadow border border-blue-200 bg-blue-50">
            <table className="w-full text-sm bg-blue-50 rounded-xl">
              <thead className="bg-blue-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 border-b border-blue-300 text-blue-900">#</th>
                  <th className="px-4 py-3 border-b border-blue-300 text-blue-900">Sale Value</th>
                  <th className="px-4 py-3 border-b border-blue-300 text-blue-900">Total Expenses</th>
                  <th className="px-4 py-3 border-b border-blue-300 text-blue-900">Net Profit</th>
                  <th className="px-4 py-3 border-b border-blue-300 text-blue-900">Revenue</th>
                  <th className="px-4 py-3 border-b border-blue-300 text-blue-900">Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {sortedHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">No sales yet.</td>
                  </tr>
                ) : sortedHistory.map((entry, idx) => {
                  const isLatest = idx === 0; // sortedHistory is latest first
                  return (
                    <tr
                      key={idx}
                      className={
                        (isLatest ? 'bg-blue-200 font-bold text-blue-900 ' : '') +
                        (idx % 2 === 0 && !isLatest ? 'bg-blue-100 ' : '') +
                        'hover:bg-blue-100 transition'
                      }
                    >
                      <td className="px-4 py-3 text-center font-semibold text-blue-700">{idx + 1}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-900 text-lg">{entry.value}</td>
                      <td className="px-4 py-3 text-center text-blue-900">{entry.totalExpenses ?? 0}</td>
                      <td className="px-4 py-3 text-center text-blue-900">{entry.netProfit ?? 0}</td>
                      <td className="px-4 py-3 text-center text-blue-900">{entry.revenue ?? 0}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{new Date(entry.date).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="my-8" />
          {/* Sale Chart */}
          <div className="mt-8 bg-white rounded-xl shadow p-6">
            <h4 className="text-blue-700 font-semibold mb-4 text-center">Sale Value Chart</h4>
            {sortedHistory.length === 0 ? (
              <div className="text-center text-gray-400">No sales to display.</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={date => new Date(date).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip labelFormatter={date => new Date(date).toLocaleString()} />
                    <Bar dataKey="value" name="Sale" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="totalExpenses" name="Total Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="netProfit" name="Net Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="revenue" name="Revenue" fill="#f59e42" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4 text-xs">
                  <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-blue-500"></span> Sale</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-500"></span> Total Expenses</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-500"></span> Net Profit</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-orange-400"></span> Revenue</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SVCDashboard;
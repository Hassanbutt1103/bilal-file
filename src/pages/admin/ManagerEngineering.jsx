import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import SaleChart from '../SaleChart';

const API_BASE = 'https://dashboard-98ck.onrender.com/api/v1/users';

const stats = [
  { label: 'Active Projects', value: '12' },
  { label: 'Engineers', value: '48' },
  { label: 'Tickets', value: '134' },
  { label: 'Deployments', value: '22' },
];

const ManagerEngineering = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saleHistory, setSaleHistory] = useState([]);

  useEffect(() => {
    const fetchAllSales = async () => {
      try {
        // Get all users
        const usersRes = await axios.get(`${API_BASE}/all`);
        if (usersRes.data.success) {
          const users = usersRes.data.users.filter(u => u.role === 'admin');
          let latestSaleValue = 0;
          let latestSaleDate = null;
          let allSales = [];
          // Fetch sales for each admin user
          for (const user of users) {
            try {
              const saleRes = await axios.get(`${API_BASE}/sale/${user._id}`);
              if (saleRes.data.success && saleRes.data.saleHistory && saleRes.data.saleHistory.length > 0) {
                allSales = allSales.concat(saleRes.data.saleHistory);
                const userLatest = saleRes.data.saleHistory.reduce((latest, curr) => new Date(curr.date) > new Date(latest.date) ? curr : latest);
                if (!latestSaleDate || new Date(userLatest.date) > new Date(latestSaleDate)) {
                  latestSaleValue = userLatest.value;
                  latestSaleDate = userLatest.date;
                }
              }
            } catch (error) { /* skip user */ }
          }
          setTotalSales(latestSaleValue);
          setSaleHistory(allSales);
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSales();
  }, []);

  const allStats = [
    ...stats,
    { label: 'Latest Sale', value: loading ? 'Loading...' : `$${totalSales.toFixed(2)}` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 flex flex-col items-center text-center border border-white/20">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">Manager Engineering Dashboard</h1>
          <p className="text-blue-200 text-lg mb-2">Aggregated engineering performance and activity</p>
          <p className="text-gray-300">Monitor projects, engineers, tickets, deployments, and total sales across all users.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {allStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-6 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white flex flex-col items-center"
            >
              <div className="text-2xl font-bold mb-2">{loading ? 'Loading...' : stat.value}</div>
              <div className="text-md font-medium tracking-wide uppercase text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Sale Chart */}
        <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Sales History (All Admins)</h2>
          <SaleChart history={saleHistory} />
        </div>
        {/* Engineering specific content can be added here */}
        <div className="bg-white/10 rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Engineering Overview</h2>
          <p className="text-white">This dashboard shows aggregated engineering metrics and total sales across all users.</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerEngineering; 
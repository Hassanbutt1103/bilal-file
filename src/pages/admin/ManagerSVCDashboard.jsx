import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SaleChart from '../SaleChart';

const API_BASE = 'https://dashboard-98ck.onrender.com/api/v1/users';

const ManagerSVCDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [saleData, setSaleData] = useState({ sale: '', saleHistory: [] });
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    // Fetch all admin users
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${API_BASE}/all`);
        if (res.data.success) {
          const adminUsers = res.data.users.filter(u => u.role === 'admin');
          setAdmins(adminUsers);
          if (adminUsers.length > 0) setSelectedAdminId(adminUsers[0]._id);
        }
      } catch (err) {
        setAdmins([]);
      }
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (selectedAdminId) {
      setLoading(true);
      axios.get(`${API_BASE}/sale/${selectedAdminId}`)
        .then(res => {
          if (res.data.success) {
            setSaleData({
              sale: res.data.sale,
              saleHistory: res.data.saleHistory || []
            });
          } else {
            setSaleData({ sale: '', saleHistory: [] });
          }
        })
        .catch(() => setSaleData({ sale: '', saleHistory: [] }))
        .finally(() => setLoading(false));
    }
  }, [selectedAdminId]);

  // Download sales as CSV
  const handleDownload = () => {
    if (!saleData.saleHistory || saleData.saleHistory.length === 0) return;
    const csvRows = [
      ['#', 'Sale Value', 'Date/Time'],
      ...saleData.saleHistory.map((s, idx) => [idx + 1, s.value, new Date(s.date).toLocaleString()])
    ];
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a2a33' }}>
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-8 flex flex-col items-center text-center border border-white/20">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 drop-shadow-lg">SVC Dashboard (Manager View)</h1>
          <p className="text-[#F6E27A] text-base mb-2">View sales for any admin user</p>
          <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-6">
            <label className="text-white font-semibold">Select Admin User:</label>
            <select
              className="rounded-lg px-4 py-2 bg-white/20 text-white border border-white/30 focus:outline-none"
              value={selectedAdminId}
              onChange={e => setSelectedAdminId(e.target.value)}
            >
              {admins.map(admin => (
                <option key={admin._id} value={admin._id}>{admin.email} ({admin.userName})</option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="text-white">Loading sales...</div>
          ) : (
            <>
              <div className="mb-4 w-full flex flex-col items-center">
                <div className="text-lg text-white font-bold mb-1">Current Sale:</div>
                <div className="text-2xl font-extrabold text-[#F6E27A] drop-shadow-lg">
                  {saleData.saleHistory && saleData.saleHistory.length > 0
                    ? saleData.saleHistory.reduce((latest, curr) => new Date(curr.date) > new Date(latest.date) ? curr : latest).value
                    : (saleData.sale || 0)}
                </div>
              </div>
              {/* Sale Chart */}
              <div className="w-full mb-4">
                <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4">Sales History (Selected Admin)</h2>
                <SaleChart history={saleData.saleHistory} />
              </div>
              <div className="w-full mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg text-white font-bold">Sale History</div>
                  <button
                    className="bg-[#F6E27A] hover:bg-[#F9F7C9] text-[#1a2a33] px-3 py-1 rounded font-semibold text-sm"
                    onClick={handleDownload}
                    disabled={!saleData.saleHistory || saleData.saleHistory.length === 0}
                  >
                    Download Sales
                  </button>
                  {downloadUrl && (
                    <a href={downloadUrl} download="sales.csv" className="hidden" id="download-link">Download</a>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-white rounded-xl overflow-hidden shadow-lg text-xs sm:text-sm md:text-base">
                    <thead>
                      <tr className="bg-[#F6E27A]/80 text-[#1a2a33]">
                        <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                        <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Sale Value</th>
                        <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Date/Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleData.saleHistory && saleData.saleHistory.length > 0 ? (
                        saleData.saleHistory.map((s, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}>
                            <td className="px-2 sm:px-4 py-2 font-medium">{idx + 1}</td>
                            <td className="px-2 sm:px-4 py-2">{s.value}</td>
                            <td className="px-2 sm:px-4 py-2">{new Date(s.date).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center text-white py-4">No sales history available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerSVCDashboard; 
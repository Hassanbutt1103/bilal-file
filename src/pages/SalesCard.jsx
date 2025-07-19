import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = 'https://dashboard-98ck.onrender.com/api/v1/users';

const SalesCard = ({ onSaleFetched }) => {
  const { user } = useAuth();
  const [latestSale, setLatestSale] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user?._id) {
      fetch(`${API_BASE}/sale/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.saleHistory) && data.saleHistory.length > 0) {
            const sorted = [...data.saleHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
            setLatestSale(sorted[0].value);
            if (onSaleFetched) onSaleFetched(sorted[0].value);
          } else {
            setLatestSale(0);
            if (onSaleFetched) onSaleFetched(0);
          }
        })
        .catch(() => {
          setLatestSale(0);
          if (onSaleFetched) onSaleFetched(0);
        })
        .finally(() => setLoading(false));
    }
  }, [user, onSaleFetched]);

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center mb-6">
      <div className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" stroke="#F6E27A" strokeWidth="2" strokeLinecap="round"/></svg>
        Sales
      </div>
      <div className="text-3xl font-extrabold text-[#F6E27A] drop-shadow-lg">
        {loading ? 'Loading...' : latestSale}
      </div>
      <div className="text-white text-xs mt-2 opacity-80">Latest updated sale</div>
    </div>
  );
};

export default SalesCard; 
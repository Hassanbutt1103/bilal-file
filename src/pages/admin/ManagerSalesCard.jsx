import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://dashboard-98ck.onrender.com/api/v1/users';

const ManagerSalesCard = ({ onSaleFetched }) => {
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAllSales = async () => {
      try {
        // First get all users
        const usersRes = await axios.get(`${API_BASE}/all`);
        if (usersRes.data.success) {
          const users = usersRes.data.users;
          let totalSalesValue = 0;
          
          // Fetch sales for each user
          for (const user of users) {
            try {
              const saleRes = await axios.get(`${API_BASE}/sale/${user._id}`);
              if (saleRes.data.success && saleRes.data.sale) {
                const sales = saleRes.data.sale.split(',').map(s => parseFloat(s) || 0);
                const userTotal = sales.reduce((sum, sale) => sum + sale, 0);
                totalSalesValue += userTotal;
              }
            } catch (error) {
              console.log(`Could not fetch sales for user ${user._id}`);
            }
          }
          
          setTotalSales(totalSalesValue);
          if (onSaleFetched) onSaleFetched(totalSalesValue);
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
        setTotalSales(0);
        if (onSaleFetched) onSaleFetched(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSales();
  }, [onSaleFetched]);

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center mb-6">
      <div className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" stroke="#F6E27A" strokeWidth="2" strokeLinecap="round"/></svg>
        Total Sales
      </div>
      <div className="text-3xl font-extrabold text-[#F6E27A] drop-shadow-lg">
        {loading ? 'Loading...' : `$${totalSales.toFixed(2)}`}
      </div>
      <div className="text-white text-xs mt-2 opacity-80">Aggregated from all users</div>
    </div>
  );
};

export default ManagerSalesCard; 
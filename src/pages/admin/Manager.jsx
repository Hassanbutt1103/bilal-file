import React, { useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { FaUsers, FaDollarSign, FaChartLine } from 'react-icons/fa';
import ManagerOverview from './ManagerOverview';
import ManagerFinancial from './ManagerFinancial';
import ManagerAccounting from './ManagerAccounting';
import ManagerEngineering from './ManagerEngineering';
import Comercial from '../Comercial/Comercial';
import ManagerSVCDashboard from './ManagerSVCDashboard';

const stats = [
  { label: 'Total Users', value: '1,200' },
  { label: 'Departments', value: '7' },
  { label: 'Active Users', value: '950' },
  { label: 'Growth', value: '+8.5%' },
];

const registrations = [
  { name: 'Jan', users: 80 },
  { name: 'Feb', users: 120 },
  { name: 'Mar', users: 150 },
  { name: 'Apr', users: 200 },
  { name: 'May', users: 250 },
  { name: 'Jun', users: 400 },
];
const rolesDistribution = [
  { name: 'Admin', value: 5 },
  { name: 'Manager', value: 8 },
  { name: 'Gerente', value: 10 },
  { name: 'Finanaceiro', value: 15 },
  { name: 'Engenharia', value: 20 },
  { name: 'RH', value: 10 },
  { name: 'Comercial', value: 15 },
  { name: 'Compras', value: 5 },
];
const activeByDept = [
  { name: 'Engenharia', users: 200 },
  { name: 'RH', users: 120 },
  { name: 'Comercial', users: 180 },
  { name: 'Finanaceiro', users: 150 },
  { name: 'Compras', users: 80 },
  { name: 'Gerente', users: 100 },
];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF6666'];

const TABS = [
  { label: 'General Overview', component: <ManagerOverview /> },
  { label: 'Financial Dashboard', component: <ManagerFinancial /> },
  { label: 'Accounting Dashboard', component: <ManagerAccounting /> },
  { label: 'Engineering Dashboard', component: <ManagerEngineering /> },
  { label: 'Commercial Dashboard', component: <Comercial /> },
  { label: 'SVC Dashboard', component: <ManagerSVCDashboard /> },
];

const Manager = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [fetchUsersLoading, setFetchUsersLoading] = useState(false);
  const [fetchUsersError, setFetchUsersError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleData, setSaleData] = useState({ sale: '', saleHistory: [] });
  const [fetchSaleLoading, setFetchSaleLoading] = useState(false);
  const [fetchSaleError, setFetchSaleError] = useState('');

  const fetchUsers = async () => {
    setFetchUsersLoading(true);
    setFetchUsersError('');
    try {
      const res = await axios.get('https://dashboard-98ck.onrender.com/api/v1/users/all');
      if (res.data.success) {
        setUsers(res.data.users);
      } else {
        setFetchUsersError(res.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setFetchUsersError('Failed to fetch users');
    } finally {
      setFetchUsersLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUserSale = async (userId) => {
    setFetchSaleLoading(true);
    setFetchSaleError('');
    try {
      const res = await axios.get(`https://dashboard-98ck.onrender.com/api/v1/users/sale/${userId}`);
      if (res.data.success) {
        setSaleData({
          sale: res.data.sale,
          saleHistory: res.data.saleHistory || []
        });
        setShowSaleModal(true);
      } else {
        setFetchSaleError(res.data.message || 'Failed to fetch sale data');
      }
    } catch (err) {
      setFetchSaleError('Failed to fetch sale data');
    } finally {
      setFetchSaleLoading(false);
    }
  };

  const handleViewSale = (user) => {
    setSelectedUser(user);
    fetchUserSale(user._id);
  };

  return (
    <div className="flex h-screen bg-[#1a2a33] overflow-hidden">
      {/* Fixed Sidebar */}
      <div
        className={`fixed h-full z-30 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} ${collapsed ? 'left-0' : 'left-0'} md:static`}
        style={{ top: 0 }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} activeTab={activeTab} setActiveTab={setActiveTab} isManager={true} />
      </div>
      
      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col ml-0 transition-all duration-300 min-w-0"
        style={{ marginLeft: collapsed ? '80px' : '240px', minWidth: 0 }}
      >
        {/* Responsive Header */}
        <header className="bg-[#1a2a33] border-b border-white/20 p-3 sm:p-4 flex flex-col gap-3 sticky top-0 z-10 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 w-full">
            <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col items-center text-center border border-white/20 w-full">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2 drop-shadow-lg flex items-center gap-2">
                <FaUsers className="text-[#F6E27A] text-2xl sm:text-3xl md:text-4xl" />
                Manager Dashboard
              </h1>
              <p className="text-[#F6E27A] text-sm sm:text-base md:text-lg mb-2">Manager Overview & User Monitoring</p>
            </div>
          </div>
        </header>
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 w-full">
          <div className="max-w-6xl mx-auto w-full">
            {/* Only show sales monitoring on General Overview tab */}
            {activeTab === 0 && (
              <>
                {/* Total Users Card */}
                <div className="mb-6 sm:mb-8 flex justify-center w-full">
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg px-6 sm:px-10 py-4 sm:py-6 flex items-center gap-4 border-2 border-[#F6E27A] w-full max-w-md">
                    <FaUsers className="text-[#F6E27A] text-2xl sm:text-3xl" />
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow">{users.length}</div>
                      <div className="text-base sm:text-lg font-semibold text-[#F6E27A]">Total Users</div>
                    </div>
                  </div>
                </div>
                
                {/* Sales Management Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 sm:p-4 md:p-8 border border-white/20 mb-8 shadow-xl overflow-x-auto">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2"><FaDollarSign className="text-[#F6E27A]" /> Sales Management</h2>
                  {fetchUsersLoading ? (
                    <div className="text-white">Loading users...</div>
                  ) : fetchUsersError ? (
                    <div className="text-red-400">{fetchUsersError}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-[500px] sm:min-w-full text-white rounded-xl overflow-hidden shadow-lg text-xs sm:text-sm md:text-base">
                        <thead>
                          <tr className="bg-[#F6E27A]/80 text-[#1a2a33]">
                            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">User Name</th>
                            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Created At</th>
                            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Sales Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, idx) => (
                            <tr key={user._id} className={idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}>
                              <td className="px-2 sm:px-4 py-2 font-medium">{user.userName}</td>
                              <td className="px-2 sm:px-4 py-2">{user.email}</td>
                              <td className="px-2 sm:px-4 py-2">
                                <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-[#F6E27A]/80 text-[#1a2a33]">
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 py-2">{new Date(user.createdAt).toLocaleString()}</td>
                              <td className="px-2 sm:px-4 py-2">
                                <button
                                  onClick={() => handleViewSale(user)}
                                  className="bg-[#F6E27A] hover:bg-[#F9F7C9] text-[#1a2a33] px-2 py-1 rounded flex items-center gap-1 font-semibold"
                                  title="View Sales"
                                >
                                  <FaDollarSign className="text-xs" />
                                  View Sales
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
                  {/* User Registration Chart */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 shadow-xl">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">User Registration Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={registrations}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="white" />
                        <YAxis stroke="white" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(26, 42, 51, 0.95)', 
                            border: '1px solid rgba(246, 226, 122, 0.3)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#F6E27A" 
                          strokeWidth={3}
                          dot={{ fill: '#F6E27A', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Role Distribution Chart */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 shadow-xl">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Role Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={rolesDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {rolesDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(26, 42, 51, 0.95)', 
                            border: '1px solid rgba(246, 226, 122, 0.3)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Department Activity Chart */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 shadow-xl mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Active Users by Department</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activeByDept}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="white" />
                      <YAxis stroke="white" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(26, 42, 51, 0.95)', 
                          border: '1px solid rgba(246, 226, 122, 0.3)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="users" fill="#F6E27A" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {/* Render the selected dashboard tab */}
            <div className="mt-8">
              {TABS[activeTab].component}
            </div>

            {/* Sale Modal */}
            {showSaleModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-2">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 sm:p-8 md:p-10 shadow-2xl w-full max-w-2xl flex flex-col items-center border-2 border-[#F6E27A] relative">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#1a2a33] flex items-center gap-2">
                    <FaDollarSign className="text-[#F6E27A]" /> 
                    Sales Data - {selectedUser?.userName}
                  </h2>
                  
                  {fetchSaleLoading ? (
                    <div className="text-[#1a2a33] text-center">Loading sale data...</div>
                  ) : fetchSaleError ? (
                    <div className="text-red-500 text-center mb-4">{fetchSaleError}</div>
                  ) : (
                    <>
                      {/* Total Sales */}
                      <div className="w-full mb-6">
                        <div className="bg-[#F6E27A]/20 rounded-xl p-4 border border-[#F6E27A]/30">
                          <h3 className="text-lg font-semibold text-[#1a2a33] mb-2 flex items-center gap-2">
                            <FaChartLine className="text-[#F6E27A]" />
                            Total Sales
                          </h3>
                          <p className="text-2xl font-bold text-[#1a2a33]">
                            {saleData.sale ? saleData.sale.split(',').map(s => parseFloat(s)).reduce((a, b) => a + b, 0).toFixed(2) : '0.00'}
                          </p>
                        </div>
                      </div>

                      {/* Sales History */}
                      <div className="w-full mb-6">
                        <h3 className="text-lg font-semibold text-[#1a2a33] mb-3 flex items-center gap-2">
                          <FaChartLine className="text-[#F6E27A]" />
                          Sales History
                        </h3>
                        <div className="max-h-60 overflow-y-auto">
                          {saleData.saleHistory && saleData.saleHistory.length > 0 ? (
                            <div className="space-y-2">
                              {saleData.saleHistory.map((sale, index) => (
                                <div key={index} className="bg-[#F6E27A]/10 rounded-lg p-3 border border-[#F6E27A]/20">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[#1a2a33] font-semibold">
                                      ${sale.value.toFixed(2)}
                                    </span>
                                    <span className="text-[#1a2a33] text-sm">
                                      {new Date(sale.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[#1a2a33] text-center py-4">
                              No sales history available
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sales Chart */}
                      {saleData.saleHistory && saleData.saleHistory.length > 0 && (
                        <div className="w-full mb-6">
                          <h3 className="text-lg font-semibold text-[#1a2a33] mb-3 flex items-center gap-2">
                            <FaChartLine className="text-[#F6E27A]" />
                            Sales Trend
                          </h3>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={saleData.saleHistory.slice(-10)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26, 42, 51, 0.2)" />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#1a2a33"
                                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                                />
                                <YAxis stroke="#1a2a33" />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                    border: '1px solid rgba(246, 226, 122, 0.3)',
                                    borderRadius: '8px',
                                    color: '#1a2a33'
                                  }}
                                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#F6E27A" 
                                  strokeWidth={3}
                                  dot={{ fill: '#F6E27A', strokeWidth: 2, r: 4 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex gap-2 sm:gap-4 w-full mt-4">
                    <button
                      type="button"
                      className="flex-1 bg-gray-200 text-[#1a2a33] py-2 rounded-lg font-semibold shadow-md hover:bg-gray-300 transition text-base sm:text-lg border-2 border-gray-300"
                      onClick={() => setShowSaleModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Manager; 
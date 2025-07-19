import React, { useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { FaUserPlus, FaUsers, FaTrash } from 'react-icons/fa';
import Overview from '../Overview';
import Financial from '../Financial';
import Accounting from '../Accounting';
import Engineering from '../Engineering';
import Comercial from '../Comercial/Comercial';
import SVCDashboard from './SVCDashboard';

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
  { label: 'General Overview', component: <Overview /> },
  { label: 'Financial Dashboard', component: <Financial /> },
  { label: 'Accounting Dashboard', component: <Accounting /> },
  { label: 'Engineering Dashboard', component: <Engineering /> },
  { label: 'Commercial Dashboard', component: <Comercial /> },
  { label: 'SVC Dashboard', component: <SVCDashboard /> },
];

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [form, setForm] = useState({ userName: '', email: '', password: '', role: '' });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [addUserSuccess, setAddUserSuccess] = useState('');
  const [users, setUsers] = useState([]);
  const [fetchUsersLoading, setFetchUsersLoading] = useState(false);
  const [fetchUsersError, setFetchUsersError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

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

  const handleAddUserChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAddUserError('');
    setAddUserSuccess('');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError('');
    setAddUserSuccess('');
    try {
      const res = await axios.post('https://dashboard-98ck.onrender.com/api/v1/users/add', form);
      if (res.data.success) {
        setAddUserSuccess('User added successfully!');
        setForm({ userName: '', email: '', password: '', role: '' });
        fetchUsers();
        setShowAddUser(false);
      } else {
        setAddUserError(res.data.message || 'Failed to add user');
      }
    } catch (err) {
      setAddUserError(err.response?.data?.message || 'Failed to add user');
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`https://dashboard-98ck.onrender.com/api/v1/users/delete/${userId}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="flex h-screen bg-[#1a2a33] overflow-hidden">
      {/* Fixed Sidebar */}
      <div
        className={`fixed h-full z-30 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} ${collapsed ? 'left-0' : 'left-0'} md:static`}
        style={{ top: 0 }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={true} />
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
                Admin Dashboard
              </h1>
              <p className="text-[#F6E27A] text-sm sm:text-base md:text-lg mb-2">Admin Overview & User Management</p>
            </div>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-[#F6E27A] to-[#F9F7C9] text-[#1a2a33] px-4 sm:px-5 md:px-7 py-2 sm:py-3 md:py-4 rounded-2xl font-bold shadow-xl hover:from-[#F9F7C9] hover:to-[#F6E27A] transition text-sm sm:text-base md:text-lg border-2 border-[#F6E27A] ml-0 md:ml-4 w-full md:w-auto"
              onClick={() => setShowAddUser(true)}
              style={{ minWidth: 120 }}
            >
              <FaUserPlus className="text-lg sm:text-xl md:text-2xl" /> Add New User
            </button>
          </div>
        </header>
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 w-full">
          <div className="max-w-6xl mx-auto w-full">
            {/* Only show user management on General Overview tab */}
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
                {/* Add User Modal/Form */}
                {showAddUser && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-2">
                    <form onSubmit={handleAddUser} className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 sm:p-8 md:p-10 shadow-2xl w-full max-w-md flex flex-col items-center border-2 border-[#F6E27A] relative">
                      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#1a2a33] flex items-center gap-2"><FaUserPlus className="text-[#F6E27A]" /> Add New User</h2>
                      {addUserError && <div className="mb-2 text-red-500 text-sm w-full text-center">{addUserError}</div>}
                      {addUserSuccess && <div className="mb-2 text-green-600 text-sm w-full text-center">{addUserSuccess}</div>}
                      <input
                        type="text"
                        name="userName"
                        placeholder="User Name"
                        className="w-full px-3 sm:px-4 py-2 mb-2 sm:mb-3 border border-[#F6E27A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E27A] bg-white text-[#1a2a33]"
                        value={form.userName}
                        onChange={handleAddUserChange}
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full px-3 sm:px-4 py-2 mb-2 sm:mb-3 border border-[#F6E27A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E27A] bg-white text-[#1a2a33]"
                        value={form.email}
                        onChange={handleAddUserChange}
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full px-3 sm:px-4 py-2 mb-2 sm:mb-3 border border-[#F6E27A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E27A] bg-white text-[#1a2a33]"
                        value={form.password}
                        onChange={handleAddUserChange}
                        required
                      />
                      <select
                        name="role"
                        className="w-full px-3 sm:px-4 py-2 mb-3 sm:mb-4 border border-[#F6E27A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E27A] bg-white text-[#1a2a33]"
                        value={form.role}
                        onChange={handleAddUserChange}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Finanaceiro">Finanaceiro</option>
                        <option value="Engenharia">Engenharia</option>
                        <option value="RH">RH</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Compras">Compras</option>
                      </select>
                      <div className="flex gap-2 sm:gap-4 w-full mt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-[#F6E27A] to-[#F9F7C9] text-[#1a2a33] py-2 rounded-lg font-semibold shadow-md hover:from-[#F9F7C9] hover:to-[#F6E27A] transition text-base sm:text-lg border-2 border-[#F6E27A]"
                          disabled={addUserLoading}
                        >
                          {addUserLoading ? 'Adding...' : 'Add User'}
                        </button>
                        <button
                          type="button"
                          className="flex-1 bg-gray-200 text-[#1a2a33] py-2 rounded-lg font-semibold shadow-md hover:bg-gray-300 transition text-base sm:text-lg border-2 border-gray-300"
                          onClick={() => setShowAddUser(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {/* User List */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 sm:p-4 md:p-8 border border-white/20 mb-8 shadow-xl overflow-x-auto">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2"><FaUsers className="text-[#F6E27A]" /> All Users</h2>
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
                            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
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
                                  className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded flex items-center gap-1"
                                  onClick={() => handleDeleteUser(user._id)}
                                  title="Delete User"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
            {/* Render the selected dashboard tab */}
            <div className="mt-8">
              {TABS[activeTab].component}
            </div>
      </div>
        </main>
    </div>
  </div>
);
};

export default Admin; 
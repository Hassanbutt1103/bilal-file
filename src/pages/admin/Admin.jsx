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
        style={{ marginLeft: 0, minWidth: 0 }}
      >
        {/* Responsive Header */}
        <header className="bg-[#1a2a33] border-b border-white/10 p-3 flex flex-row justify-between items-center gap-2 sticky top-0 z-10 w-full">
          <div className="flex flex-col items-start text-left">
            <h1 className="text-lg font-semibold text-[#D6A647] mb-1">Admin Dashboard</h1>
            <p className="text-white/70 text-xs mb-1">Admin Overview & User Management</p>
          </div>
          <button
            className="px-3 py-1 rounded-md bg-[#D6A647] text-[#1a2a33] text-xs font-semibold border border-[#D6A647] hover:bg-[#f7f9fa] hover:border-[#f7f9fa] transition"
            onClick={() => setShowAddUser(true)}
          >
            Add New User
          </button>
        </header>
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto w-full">
            {/* Only show user management on General Overview tab */}
            {activeTab === 0 && (
              <>
                {/* Total Users Card */}
                <div className="mb-4 flex justify-center w-full">
                  <div className="bg-[#D6A647]/10 rounded px-4 py-3 flex items-center gap-3 border border-[#D6A647]/30 w-full max-w-md">
                    <div className="text-base font-semibold text-[#D6A647]">{users.length}</div>
                    <div className="text-xs font-normal text-white/70">Total Users</div>
                  </div>
                </div>
                {/* Add User Modal/Form */}
                {showAddUser && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2">
                    <form onSubmit={handleAddUser} className="bg-[#1a2a33] rounded-xl p-4 w-full max-w-md flex flex-col items-center border border-[#D6A647]/30 relative">
                      <h2 className="text-base font-semibold mb-3 text-[#D6A647]">Add New User</h2>
                      {addUserError && <div className="mb-2 text-red-400 text-xs w-full text-center">{addUserError}</div>}
                      {addUserSuccess && <div className="mb-2 text-green-400 text-xs w-full text-center">{addUserSuccess}</div>}
                      <input
                        type="text"
                        name="userName"
                        placeholder="User Name"
                        className="w-full px-3 py-2 mb-2 border border-[#D6A647]/30 rounded bg-transparent text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#D6A647]"
                        value={form.userName}
                        onChange={handleAddUserChange}
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 mb-2 border border-[#D6A647]/30 rounded bg-transparent text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#D6A647]"
                        value={form.email}
                        onChange={handleAddUserChange}
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 mb-2 border border-white/10 rounded bg-transparent text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                        value={form.password}
                        onChange={handleAddUserChange}
                        required
                      />
                      <select
                        name="role"
                        className="w-full px-3 py-2 mb-3 border border-[#D6A647]/30 rounded bg-transparent text-black text-sm focus:outline-none focus:ring-1 focus:ring-[#D6A647]"
                        value={form.role}
                        onChange={handleAddUserChange}
                        required
                        style={{ color: 'black', backgroundColor: 'white' }}
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
                          className="flex-1 bg-white/10 text-white py-2 rounded font-semibold text-sm border border-white/10 hover:bg-white/20 transition"
                          disabled={addUserLoading}
                        >
                          {addUserLoading ? 'Adding...' : 'Add User'}
                        </button>
                        <button
                          type="button"
                          className="flex-1 bg-gray-200 text-[#1a2a33] py-2 rounded font-semibold text-sm border-2 border-gray-300"
                          onClick={() => setShowAddUser(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {/* User List */}
                <div className="bg-[#D6A647]/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 px-4 mb-6 sm:mb-8 flex flex-col items-center text-center border border-[#D6A647]/30 overflow-x-auto w-full">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#D6A647] mb-2 px-4 text-center">All Users</h2>
                  {fetchUsersLoading ? (
                    <div className="text-white/70">Loading users...</div>
                  ) : fetchUsersError ? (
                    <div className="text-red-400">{fetchUsersError}</div>
                  ) : (
                    <div className="overflow-x-auto w-full">
                      <table className="min-w-full w-full text-white rounded overflow-hidden text-xs">
                        <thead>
                          <tr className="bg-[#D6A647]/80 text-[#1a2a33]">
                            <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">User Name</th>
                            <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                            <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                            <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Created At</th>
                            <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, idx) => (
                            <tr key={user._id} className={idx % 2 === 0 ? 'bg-[#D6A647]/5' : ''}>
                              <td className="px-2 py-2 font-normal">{user.userName}</td>
                              <td className="px-2 py-2">{user.email}</td>
                              <td className="px-2 py-2">
                                <span className="inline-block px-2 py-1 rounded text-xs font-normal bg-[#D6A647]/20 text-[#1a2a33]">
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-2 py-2">{new Date(user.createdAt).toLocaleString()}</td>
                              <td className="px-2 py-2">
                                <button
                                  className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded border border-transparent hover:border-red-400 transition"
                                  onClick={() => handleDeleteUser(user._id)}
                                  title="Delete User"
                                >
                                  Delete
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
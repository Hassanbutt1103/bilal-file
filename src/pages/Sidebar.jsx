import React, { useState } from 'react';
import { FaBars, FaChartPie, FaMoneyBill, FaCalculator, FaCogs, FaBuilding, FaSignOutAlt, FaServer } from 'react-icons/fa';
import { useNavigate, NavLink } from 'react-router-dom';
import novaLogo from '../assets/Nova Logo VP.png';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { name: 'General Overview', icon: <FaChartPie className="text-white" />, path: '/overview' },
  { name: 'Financial Dashboard', icon: <FaMoneyBill className="text-white" />, path: '/financial' },
  { name: 'Accounting Dashboard', icon: <FaCalculator className="text-white" />, path: '/accounting' },
  { name: 'Engineering Dashboard', icon: <FaCogs className="text-white" />, path: '/engineering' },
  { name: 'Commercial Dashboard', icon: <FaBuilding className="text-white" />, path: '/commercial' },
  { name: 'SVC Dashboard', icon: <FaServer className="text-white" />, path: '/svc' },
];

const roleToAllowedLinks = {
  admin: navLinks.map(link => link.name),
  manager: navLinks.map(link => link.name),
  Gerente: navLinks.map(link => link.name),
  Manager: navLinks.map(link => link.name),
  Finanaceiro: ['Financial Dashboard', 'General Overview'],
  Engenharia: ['Engineering Dashboard', 'General Overview'],
  RH: ['General Overview', 'SVC Dashboard'], // Adjust as needed
  Comercial: ['Commercial Dashboard', 'General Overview'],
  Compras: ['General Overview'], // Adjust as needed
};

const Sidebar = ({ collapsed, setCollapsed, activeTab, setActiveTab, isAdmin, isManager, mobile = false, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const handleLogout = () => {
    navigate('/');
  };

  // Role-based nav links
  let filteredLinks = navLinks;
  if (user && user.role && !['admin', 'manager', 'Gerente', 'Manager'].includes(user.role)) {
    const allowed = roleToAllowedLinks[user.role] || ['General Overview'];
    filteredLinks = navLinks.filter(link => allowed.includes(link.name));
  }

  // Mobile: Only show menu button at bottom if drawer is closed
  if (mobile && !mobileDrawerOpen) {
    return (
      <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 bg-[#1a2a33] p-3">
        <button
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white shadow-lg"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open sidebar"
        >
          <FaBars size={28} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`h-screen backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} relative z-30 ${mobile ? 'fixed top-0 left-0 z-50 bg-[#1a2a33] w-64' : ''}`}
      style={{ backgroundColor: '#1a2a33' }}
    >
      {/* Close button for mobile overlay */}
      {mobile && (
        <button
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white shadow-lg"
          onClick={() => { setMobileDrawerOpen(false); if (onClose) onClose(); }}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      )}
      {/* Logo/Avatar */}
      <div className={`flex items-center border-b border-white/10 p-6 pb-2 transition-all duration-300 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        {!collapsed && (
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCollapsed(true)}
          >
            <img 
              src={novaLogo} 
              alt="Nova Logo" 
              className="w-20 h-10 object-contain" 
            />
            <span className="font-extrabold text-xl text-white tracking-wide drop-shadow-lg transition-all duration-300">
              DASH VP ENGENHARIA
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors focus:outline-none shadow ${collapsed ? 'ml-0' : 'ml-auto'}`}
        >
          <FaBars size={22} className="text-white" />
        </button>
      </div>
      <nav className="flex-1 mt-4 space-y-1">
        {filteredLinks.map((link, idx) => (
          (isAdmin || isManager) ? (
            <button
              key={link.name}
              onClick={() => setActiveTab(idx)}
              className={`sidebar-item-button w-full flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors ${collapsed ? 'justify-center' : ''} hover:bg-[#D6A647]/20 focus:bg-[#D6A647]/20 ${activeTab === idx ? 'bg-[#D6A647]/30 text-[#D6A647] font-bold' : 'text-white'}`}
              style={{ outline: 'none', border: 'none', background: 'none' }}
            >
              {React.cloneElement(link.icon, { className: `${activeTab === idx ? 'text-[#D6A647]' : 'text-white'}` })}
              <span className={`font-medium tracking-wide ${collapsed ? 'hidden' : 'block'}`}>{link.name}</span>
            </button>
          ) : (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `sidebar-item flex items-center gap-3 px-5 py-3 mx-2 rounded-xl transition-colors ${collapsed ? 'justify-center' : ''} hover:bg-[#D6A647]/20 focus:bg-[#D6A647]/20 ${isActive ? 'bg-[#D6A647]/30 text-[#D6A647] font-bold' : 'text-white'}`
              }
            >
              {link.icon}
              <span className={`font-medium tracking-wide ${collapsed ? 'hidden' : 'block'} ${isActive ? 'text-[#D6A647]' : 'text-white'}`}>{link.name}</span>
            </NavLink>
          )
        ))}
      </nav>
      <div className="mt-auto mb-6 px-2">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-5 py-3 bg-[#1a2a33] hover:bg-[#2a3a43] transition-colors rounded-xl shadow-lg border border-white/20 ${collapsed ? 'justify-center' : ''}`}
        >
          <FaSignOutAlt className="text-white" />
          <span className={`text-white ${collapsed ? 'hidden' : 'block'}`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 
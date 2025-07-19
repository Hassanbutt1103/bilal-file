import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import novaLogo from '../assets/Nova Logo VP.png';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const roleToPath = {
  admin: '/admin',
  manager: '/manager',
  Gerente: '/gerente',
  Finanaceiro: '/finanaceiro',
  Engenharia: '/engenharia',
  RH: '/rh',
  Comercial: '/comercial',
  Compras: '/compras',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedInRole, setLoggedInRole] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('https://dashboard-98ck.onrender.com/api/v1/users/login', {
        identifier: email,
        password,
        role,
      });
      if (res.data.success) {
        if (res.data.user.role !== role) {
          setError('Role does not match for this user.');
        } else {
          login(res.data.user, res.data.token);
          setLoggedInRole(res.data.user.role); // Show role after login
          const path = roleToPath[res.data.user.role] || '/';
          setTimeout(() => navigate(path), 1500); // Delay navigation to show role
        }
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#1a2a33', fontFamily: 'Inter, sans-serif' }}>
      {/* Mobile: Full background image, card overlay */}
      <div className="md:hidden fixed inset-0 z-0" style={{
        backgroundImage: `linear-gradient(rgba(26, 42, 51, 0.85), rgba(26, 42, 51, 0.85)), url('/372748-PC42NW-151.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
      }} />
      <div className="w-full md:w-1/2 flex items-center justify-center md:static fixed inset-0 z-10" style={{ backgroundColor: '#1a2a33' }}>
        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/70 md:bg-white/80 p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center m-4 md:m-8 border border-gray-200">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-3">
              <img src={novaLogo} alt="Nova Logo" className="w-28 h-16 object-contain" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#1a2a33] mb-1 text-center w-full">DASH VP ENGENHARIA</h2>
            <div className="text-[13px] mt-1 mb-1" style={{ color: '#D6A647', fontFamily: 'Rajdhani, Orbitron, Titillium Web, Exo 2, Inter, sans-serif', textAlign: 'center', width: '100%', fontStyle: 'italic' }}>
              Excelência técnica e compromisso: construindo resultados sólidos para quem entende de posto.
            </div>
          </div>
          {error && <div className="mb-4 text-red-400 text-sm w-full text-center">{error}</div>}
          {loggedInRole && (
            <div className="mb-4 text-green-600 text-sm w-full text-center">
              Logged in as: <b>{loggedInRole}</b>
            </div>
          )}
          <div className="mb-4 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="role">Role</label>
            <select
              id="role"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition"
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
          </div>
          <div className="mb-6 w-full">
            <label className="block mb-1 font-semibold text-[#1a2a33]" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 bg-[#f7f9fa] text-[#1a2a33] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a33] transition placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1a2a33] text-white py-2.5 rounded-lg font-semibold shadow-md text-lg mb-2 login-animated focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div style={{ marginTop: 10, textAlign: 'center', width: '100%' }}>
            <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
          </div>
        </form>
      </div>
      {/* Border Line and Right Background for Desktop */}
      <div className="hidden md:block w-px bg-gray-300 h-screen" />
      <div className="hidden md:block w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(26, 42, 51, 0.85), rgba(26, 42, 51, 0.85)), url('/372748-PC42NW-151.jpg')`,
            backgroundSize: '110%',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default Login; 
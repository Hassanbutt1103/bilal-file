import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './pages/Layout';
import Overview from './pages/Overview';
import Financial from './pages/Financial';
import Accounting from './pages/Accounting';
import Engineering from './pages/Engineering';
import Commercial from './pages/Commercial';
import Admin from './pages/admin/Admin';
import Manager from './pages/admin/Manager';
import Gerente from './pages/Gerente/Gerente';
import Finanaceiro from './pages/Finanaceiro/Finanaceiro';
import Engenharia from './pages/Engenharia/Engenharia';
import RH from './pages/RH/RH';
import Comercial from './pages/Comercial/Comercial';
import Compras from './pages/Compras/Compras';
import ProtectedRoute from './contexts/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute requiredRole="admin" />}> <Route path="/admin" element={<Admin />} /> </Route>
        <Route element={<ProtectedRoute requiredRole="manager" />}> <Route path="/manager" element={<Manager />} /> </Route>
        <Route element={<ProtectedRoute requiredRole="Gerente" />}> <Route path="/gerente" element={<Gerente />} /> </Route>
        <Route element={<ProtectedRoute requiredRole="Finanaceiro" />}> <Route path="/finanaceiro" element={<Finanaceiro />} /> </Route>
        <Route element={<ProtectedRoute requiredRole="Engenharia" />}> <Route path="/engenharia" element={<Engenharia />} /> </Route>
        <Route element={<ProtectedRoute requiredRole="RH" />}> <Route path="/rh" element={<RH />} /> </Route>
        <Route element={<ProtectedRoute requiredRole="Comercial" />}> <Route path="/comercial" element={<Comercial />} /> </Route>
        <Route element={<ProtectedRoute requiredRole="Compras" />}> <Route path="/compras" element={<Compras />} /> </Route>
        {/* Optionally, add a default protected route for overview/dashboard for admin only */}
        <Route element={<ProtectedRoute requiredRole="admin" />}> <Route path="/overview" element={<Overview />} /> </Route>
        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

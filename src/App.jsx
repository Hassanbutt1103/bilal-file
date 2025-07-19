import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const Login = lazy(() => import('./pages/Login'));
const Layout = lazy(() => import('./pages/Layout'));
const Overview = lazy(() => import('./pages/Overview'));
const Financial = lazy(() => import('./pages/Financial'));
const Accounting = lazy(() => import('./pages/Accounting'));
const Engineering = lazy(() => import('./pages/Engineering'));
const Commercial = lazy(() => import('./pages/Commercial'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const Manager = lazy(() => import('./pages/admin/Manager'));
const Gerente = lazy(() => import('./pages/Gerente/Gerente'));
const Finanaceiro = lazy(() => import('./pages/Finanaceiro/Finanaceiro'));
const Engenharia = lazy(() => import('./pages/Engenharia/Engenharia'));
const RH = lazy(() => import('./pages/RH/RH'));
const Comercial = lazy(() => import('./pages/Comercial/Comercial'));
const Compras = lazy(() => import('./pages/Compras/Compras'));
import ProtectedRoute from './contexts/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div style={{color:'#D6A647',textAlign:'center',marginTop:'2rem'}}>Loading...</div>}>
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
      </Suspense>
    </Router>
  );
};

export default App;

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      {/* Hamburger for mobile */}
      <button
        className="block md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <FaBars size={28} />
      </button>
      {/* Sidebar overlay for mobile */}
      {mobileOpen && (
        <>
          {/* Overlay background */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
          <Sidebar
            mobile={true}
            onClose={() => setMobileOpen(false)}
            collapsed={false}
            setCollapsed={() => {}}
          />
        </>
      )}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 
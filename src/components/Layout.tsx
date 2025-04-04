
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from '@/components/ui/sonner';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-phoenix-cream">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Outlet />
      </main>
      <footer className="bg-phoenix-blue text-white p-4 text-center">
        <p>© 2025 Phoenix Safety Guardian</p>
        <p className="text-sm text-phoenix-lightblue">Protecting women across India</p>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;

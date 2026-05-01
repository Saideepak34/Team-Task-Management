import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AppShell = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title={title} />
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;

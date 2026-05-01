import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserCircle2 } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Workspace</p>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <UserCircle2 className="h-6 w-6 text-slate-500" />
          <div className="text-sm">
            <p className="font-semibold text-slate-900">{user?.name || 'Team Member'}</p>
            <p className="text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

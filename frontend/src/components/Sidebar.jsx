import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', to: '/projects', icon: FolderOpen },
  { label: 'Tasks', to: '/tasks', icon: ClipboardList },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex md:w-80 md:flex-col md:border-r md:border-slate-200 md:bg-white md:px-6 md:py-8">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-600 text-white shadow-lg shadow-sky-600/5">
          TT
        </div>
        <div>
          <p className="text-sm text-slate-500">Team Task</p>
          <h2 className="text-xl font-semibold text-slate-900">Manager</h2>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-10">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';

const statusColors = {
  Completed: 'bg-emerald-100 text-emerald-800',
  'In Progress': 'bg-sky-100 text-sky-800',
  Pending: 'bg-amber-100 text-amber-800',
};

const Badge = ({ status }) => {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColors[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
};

export default Badge;

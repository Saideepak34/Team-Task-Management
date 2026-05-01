import React from 'react';

const Input = ({ label, className = '', rows = 4, ...props }) => {
  const inputClass = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      {props.as === 'textarea' ? (
        <textarea className={`${inputClass} resize-none`} rows={rows} {...props} />
      ) : (
        <input className={inputClass} {...props} />
      )}
    </div>
  );
};

export default Input;

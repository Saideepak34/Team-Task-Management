import React from 'react';

const variantStyles = {
  primary: 'bg-sky-600 text-white hover:bg-sky-700',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
};

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

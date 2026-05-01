import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ open, title, description, onClose, children, footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 flex flex-col max-h-[90vh]">
        <div className="mb-6 flex items-start justify-between gap-4 p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
          </div>
          <Button variant="secondary" onClick={onClose} className="h-11 w-11 p-0 flex-shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="space-y-4">{children}</div>
        </div>
        {footer && <div className="mt-4 border-t border-slate-200 p-6 flex justify-end">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;

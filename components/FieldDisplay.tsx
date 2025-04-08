// components/FieldDisplay.tsx
import React from 'react';

interface FieldDisplayProps {
  label: string;
  value: string | number | React.ReactNode;
  className?: string;
}

export const FieldDisplay = ({ 
  label, 
  value, 
  className = '' 
}: FieldDisplayProps) => (
  <div className={className}>
    <label className="block pb-[11px] text-sm text-sky-950 font-medium">
      {label}
    </label>
    <div className="p-2 bg-gray-100 rounded-md border border-sky-300 min-h-[38px]">
      {value || <span className="text-gray-400">No especificado</span>}
    </div>
  </div>
);
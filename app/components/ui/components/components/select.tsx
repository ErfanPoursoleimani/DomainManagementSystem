'use client';

import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: any; label: any }[];
}

export const Select: React.FC<SelectProps> = ({ options, className, ...props }) => {
  return (
    <select
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-0 sm:text-sm ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
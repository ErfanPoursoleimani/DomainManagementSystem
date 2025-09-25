'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-0 placeholder-gray-400 sm:text-sm ${className}`}
      {...props}
    />
  );
};
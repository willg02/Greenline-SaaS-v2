import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium';
  const styles = variant === 'primary'
    ? 'bg-green-600 text-white hover:bg-green-700'
    : 'bg-gray-100 text-gray-900 hover:bg-gray-200';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
};

export default { Button };

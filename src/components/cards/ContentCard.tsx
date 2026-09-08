import React from 'react';

export interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  radius?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  children,
  className = '',
  onClick,
  radius = 'md',
  interactive = false,
}) => {
  const radiusClasses = {
    sm: 'rounded-[8px]',
    md: 'rounded-[12px]',
    lg: 'rounded-[16px]',
  }[radius];

  const Component = onClick || interactive ? 'article' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`w-full bg-white border border-[#E8E5DF] p-4 text-[#1F2421] transition-all duration-150 ${radiusClasses} ${
        onClick || interactive
          ? 'cursor-pointer hover:border-[#16325C]/25 hover:shadow-xs tap-active'
          : ''
      } ${className}`}
    >
      {children}
    </Component>
  );
};

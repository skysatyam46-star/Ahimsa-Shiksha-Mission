import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  disablePadding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  disablePadding = false,
}) => {
  return (
    <main
      className={`w-full max-w-[430px] mx-auto min-h-[calc(100vh-56px)] flex flex-col ${
        disablePadding ? '' : 'px-4 py-5'
      } pb-24 ${className}`}
    >
      {children}
    </main>
  );
};

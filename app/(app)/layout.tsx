'use client';

import React from 'react';

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className='border-2 border-white'>{children}</div>;
};

export default AppLayout;

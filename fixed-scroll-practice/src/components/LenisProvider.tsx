// components/LenisProvider.tsx
'use client'; // Required if using Next.js app router

import React, { type PropsWithChildren } from 'react';
import { ReactLenis } from 'lenis/react'

const LenisProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // Options are fully typed
  const options = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    // Add other options as needed
  };

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;

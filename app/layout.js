"use client"; // Enable Client Component

import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

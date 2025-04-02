'use client'

import { usePathname } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import { SessionProvider } from 'next-auth/react';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
    <SessionProvider>
      {!isDashboard && <Header />}
      {children}
      {!isDashboard && <Footer />}
      </SessionProvider>
    </>
  );
}

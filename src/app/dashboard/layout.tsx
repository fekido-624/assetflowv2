"use client";

import { SidebarNav } from '@/components/layout/sidebar-nav';
import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const user = store.getCurrentUser();
    if (!user) {
      router.push('/');
    } else {
      setIsLoaded(true);
    }
  }, [router]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <SidebarNav />
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/shared.components/Sidebar';
import { Navbar } from '@/components/shared.components/Navbar';
import { CreateContainerModal } from '@/components/container.components/CreateContainerModal';
import { DeleteContainerModal } from '@/components/container.components/DeleteContainerModal';
import { RenameContainerModal } from '@/components/container.components/RenameContainerModal';

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Content area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>

      {/* Modals */}
      <CreateContainerModal />
      <DeleteContainerModal />
      <RenameContainerModal />
    </div>
  );
}
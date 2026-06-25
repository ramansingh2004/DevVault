'use client';

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
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Content area */}
        <div className="min-h-0 flex-1 overflow-y-auto">
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
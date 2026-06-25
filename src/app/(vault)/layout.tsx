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
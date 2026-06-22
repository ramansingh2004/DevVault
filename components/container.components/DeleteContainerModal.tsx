'use client';

import { useUIStore } from '@/store/ui.store';
import { useDeleteContainer } from '@/hooks/useContainers';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui.components/Button';
import { AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

export function DeleteContainerModal() {
  const { deleteModalOpen, closeDeleteModal, selectedContainerId } = useUIStore();
  const deleteContainer = useDeleteContainer();
  const router = useRouter();

  const handleDelete = async () => {
    if (!selectedContainerId) return;

    try {
      await deleteContainer.mutateAsync(selectedContainerId);
      toast.success('Container deleted successfully');
      closeDeleteModal();
      router.push('/vault');
    } catch (error: any) {
      toast.error(error?.response?.data?.detail?.[0]?.msg || 'Failed to delete container');
    }
  };

  if (!deleteModalOpen || !selectedContainerId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-destructive" size={24} />
            <h2 className="text-xl font-bold">Delete Container</h2>
          </div>
          <button
            onClick={closeDeleteModal}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete this container? This action cannot be undone and all blocks within will be permanently deleted.
          </p>

          <div className="bg-destructive/10 p-3 rounded-md">
            <p className="text-sm text-destructive font-medium">
              This will delete all content in this container
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={closeDeleteModal}
            disabled={deleteContainer.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteContainer.isPending}
          >
            {deleteContainer.isPending ? 'Deleting...' : 'Delete Container'}
          </Button>
        </div>
      </div>
    </div>
  );
}
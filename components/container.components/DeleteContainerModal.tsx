'use client';

import { useUIStore } from '@/store/ui.store';
import { useDeleteContainer } from '@/hooks/useContainers';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui.components/Button';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui.components/Dialog';
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

  return (
    <Dialog open={deleteModalOpen} onOpenChange={closeDeleteModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-destructive" size={24} />
            <DialogTitle>Delete Container</DialogTitle>
          </div>
          <DialogDescription>
            This action cannot be undone. All blocks within will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md">
            <p className="text-sm text-destructive font-medium">
              Warning: This will delete all content in this container
            </p>
          </div>
        </DialogBody>

        {/* Actions */}
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
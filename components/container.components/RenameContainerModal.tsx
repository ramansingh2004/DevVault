'use client';

import { useState } from 'react';
import { useUIStore } from '@/store/ui.store';
import { useUpdateContainer, useContainers } from '@/hooks/useContainers';
import { Button } from '@/components/ui.components/Button';
import { Input } from '@/components/ui.components/Input';
import { Label } from '@/components/ui.components/Label';
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
import { getErrorMessage } from '@/lib/error';

const ICON_OPTIONS = ['📦', '📝', '💻', '🎨', '📚', '🔧', '📊', '🎯', '⚡', '🌟'];

export function RenameContainerModal() {
  const { renameModalOpen, closeRenameModal, selectedContainerId, renameContainerTitle } =
    useUIStore();
  const updateContainer = useUpdateContainer();
  const { data: containers } = useContainers();

  const currentContainer = containers?.find((c) => c.id === selectedContainerId);
  const containerIcon = currentContainer?.icon || '📦';

  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📦');
  const [prevSelectedId, setPrevSelectedId] = useState<string | null>(null);

  if (selectedContainerId !== prevSelectedId) {
    setPrevSelectedId(selectedContainerId);
    setTitle(renameContainerTitle || '');
    setIcon(containerIcon);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedContainerId) return;

    if (!title.trim()) {
      toast.error('Please enter a container title');
      return;
    }

    try {
      await updateContainer.mutateAsync({
        id: selectedContainerId,
        data: {
          title: title.trim(),
          icon,
        },
      });

      toast.success('Container updated successfully');
      closeRenameModal();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to update container'));
    }
  };

  return (
    <Dialog open={renameModalOpen} onOpenChange={closeRenameModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Container</DialogTitle>
          <DialogDescription>
            Update the container name and icon
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogBody className="space-y-4">
            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={updateContainer.isPending}
                autoFocus
              />
            </div>

            {/* Icon Selector */}
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-5 gap-2">
                {ICON_OPTIONS.map((iconOption) => (
                  <button
                    key={iconOption}
                    type="button"
                    onClick={() => setIcon(iconOption)}
                    className={`p-2 rounded-md text-2xl transition-colors ${
                      icon === iconOption
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-accent'
                    }`}
                  >
                    {iconOption}
                  </button>
                ))}
              </div>
            </div>
          </DialogBody>

          {/* Action Buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeRenameModal}
              disabled={updateContainer.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateContainer.isPending}>
              {updateContainer.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
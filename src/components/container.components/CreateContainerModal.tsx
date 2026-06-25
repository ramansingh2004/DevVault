'use client';

import { useState } from 'react';
import { useUIStore } from '@/store/ui.store';
import { useCreateContainer } from '@/hooks/useContainers';
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

export function CreateContainerModal() {
  const { createModalOpen, closeCreateModal } = useUIStore();
  const createContainer = useCreateContainer();

  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📦');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a container title');
      return;
    }

    try {
      await createContainer.mutateAsync({
        title: title.trim(),
        icon,
      });

      toast.success('Container created successfully');
      setTitle('');
      setIcon('📦');
      closeCreateModal();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to create container'));
    }
  };

  return (
    <Dialog open={createModalOpen} onOpenChange={closeCreateModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Container</DialogTitle>
          <DialogDescription>
            Create a new container to organize your knowledge
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogBody className="space-y-4">
            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="My Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={createContainer.isPending}
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
              onClick={closeCreateModal}
              disabled={createContainer.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createContainer.isPending}>
              {createContainer.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
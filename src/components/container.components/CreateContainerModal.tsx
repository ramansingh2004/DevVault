'use client';

import { useState } from 'react';
import { useUIStore } from '@/store/ui.store';
import { useCreateContainer, useContainers } from '@/hooks/useContainers';
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
  const { createModalOpen, closeCreateModal, parentContainerId } = useUIStore();
  const { data: containers } = useContainers();
  const createContainer = useCreateContainer();

  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📦');

  // Get parent container name for display
  const parentContainer = containers?.find((c) => c.id === parentContainerId);
  const isChildContainer = !!parentContainerId;

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
        parent_id: parentContainerId, // UPDATED: include parent_id for child containers
      });

      toast.success(
        isChildContainer 
          ? `Child container "${title}" created successfully`
          : 'Container created successfully'
      );
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
          <DialogTitle>
            {isChildContainer ? 'Create Child Container' : 'Create Container'}
          </DialogTitle>
          <DialogDescription>
            {isChildContainer ? (
              <>
                Create a nested container under{' '}
                <span className="font-semibold text-foreground">
                  {parentContainer?.icon} {parentContainer?.title}
                </span>
              </>
            ) : (
              'Create a new container to organize your knowledge'
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogBody className="space-y-4">
            {/* Parent Container Info */}
            {isChildContainer && parentContainer && (
              <div className="p-3 rounded-md bg-accent/50 border border-accent">
                <p className="text-xs text-muted-foreground">Parent Container</p>
                <p className="text-sm font-medium">
                  {parentContainer.icon} {parentContainer.title}
                </p>
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder={isChildContainer ? 'Nested item name' : 'My Notes'}
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
              {createContainer.isPending 
                ? 'Creating...' 
                : isChildContainer 
                  ? 'Create Child'
                  : 'Create'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
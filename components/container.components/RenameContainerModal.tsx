'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/store/ui.store';
import { useUpdateContainer } from '@/hooks/useContainers';
import { Button } from '@/components/ui.components/Button';
import { Input } from '@/components/ui.components/Input';
import { Label } from '@/components/ui.components/Label';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const ICON_OPTIONS = ['📦', '📝', '💻', '🎨', '📚', '🔧', '📊', '🎯', '⚡', '🌟'];

export function RenameContainerModal() {
  const { renameModalOpen, closeRenameModal, selectedContainerId, renameContainerTitle } =
    useUIStore();
  const updateContainer = useUpdateContainer();

  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📦');

  useEffect(() => {
    if (renameContainerTitle) {
      setTitle(renameContainerTitle);
    }
  }, [renameContainerTitle]);

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
    } catch (error: any) {
      toast.error(error?.response?.data?.detail?.[0]?.msg || 'Failed to update container');
    }
  };

  if (!renameModalOpen || !selectedContainerId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-xl font-bold">Rename Container</h2>
          <button
            onClick={closeRenameModal}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6">
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

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t border-border">
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
          </div>
        </form>
      </div>
    </div>
  );
}
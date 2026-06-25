'use client';

import { useContainer, useContainers } from '@/hooks/useContainers';
import { useBlocks, useCreateBlocks, useDeleteBlock, useUpdateBlocks } from '@/hooks/useBlocks';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useParams } from 'next/navigation';
import { ArrowLeft, FolderPlus, Package, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui.components/Button';
import { BlockRenderer } from '@/components/block.components/BlockRenderer';
import { Breadcrumb } from '@/components/shared.components/BreadCrumb';
import { toast } from 'sonner';
import { useUIStore } from '@/store/ui.store';

export default function ContainerPage() {
  const params = useParams();
  const containerId = params.containerId as string;

  const { data: container, isLoading: isContainerLoading } = useContainer(containerId);
  const { data: allContainers } = useContainers();
  const { data: blocks, isLoading: isBlocksLoading } = useBlocks(containerId);
  const breadcrumbs = useBreadcrumbs(containerId, allContainers);
  const createBlocks = useCreateBlocks();
  const updateBlocks = useUpdateBlocks();
  const deleteBlock = useDeleteBlock(containerId);

  const [newBlockType, setNewBlockType] = useState<'heading' | 'paragraph' | 'code' | 'image' | 'link'>('paragraph');
  const [showAddBlock, setShowAddBlock] = useState(false);
  const { expandedContainers, setExpandedContainers, openCreateModal, openDeleteModal } = useUIStore();

  const handleAddBlock = async () => {
    try {
      await createBlocks.mutateAsync({
        container_id: containerId,
        blocks: [
          {
            type: newBlockType,
            content:
              newBlockType === 'heading'
                ? 'New heading'
                : newBlockType === 'code'
                  ? '// Your code here\n'
                  : 'Type something...',
            order_index: blocks?.length || 0,
            meta: newBlockType === 'heading' ? { level: 1 } : newBlockType === 'code' ? { language: 'javascript' } : undefined,
          },
        ],
      });
      toast.success('Block created');
      setShowAddBlock(false);
    } catch {
      toast.error('Failed to create block');
    }
  };

  const handleAddChildContainer = () => {
    openCreateModal(containerId);
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await deleteBlock.mutateAsync(blockId);
      toast.success('Block deleted');
    } catch {
      toast.error('Failed to delete block');
    }
  };

  useEffect(() => {
    if (breadcrumbs.length > 0) {
      const containerIds = breadcrumbs.map((b) => b.id);
      const frameId = requestAnimationFrame(() => {
        const newExpanded = new Set(expandedContainers);
        let changed = false;
        containerIds.forEach((id) => {
          if (!newExpanded.has(id)) {
            newExpanded.add(id);
            changed = true;
          }
        });
        if (changed) {
          setExpandedContainers(newExpanded);
        }
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [breadcrumbs, expandedContainers, setExpandedContainers]);

  const handleUpdateBlock = async (blockId: string, newContent: string) => {
    try {
      const block = blocks?.find((b) => b.id === blockId);
      if (!block) return;

      await updateBlocks.mutateAsync({
        blocks: [
          {
            block_id: blockId,
            content: newContent,
          },
        ],
      });
      toast.success('Block updated');
    } catch {
      toast.error('Failed to update block');
    }
  };

  if (isContainerLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded-md w-1/3 animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!container) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Container not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {breadcrumbs.length > 0 && (
        <div className="pb-4 border-b border-border">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span>{container.icon || <Package size={28} />}</span>
              {container.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {blocks?.length || 0} blocks - Created {new Date(container.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {showAddBlock ? (
            <div className="flex gap-2">
              <select
                value={newBlockType}
                onChange={(e) => setNewBlockType(e.target.value as 'heading' | 'paragraph' | 'code' | 'image' | 'link')}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="heading">Heading</option>
                <option value="paragraph">Paragraph</option>
                <option value="code">Code</option>
                <option value="image">Image</option>
                <option value="link">Link</option>
              </select>
              <Button size="sm" onClick={handleAddBlock} disabled={createBlocks.isPending}>
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddBlock(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <Button size="sm" onClick={() => setShowAddBlock(true)} className="gap-2">
                <Plus size={16} />
                Add Block
              </Button>
              <Button size="sm" variant="outline" onClick={handleAddChildContainer} className="gap-2">
                <FolderPlus size={16} />
                Add Child Container
              </Button>
              <Button size="sm" variant="destructive" onClick={() => openDeleteModal(containerId)} className="gap-2">
                <Trash2 size={16} />
                Delete Container
              </Button>
            </>
          )}
        </div>
      </div>

      {container.children.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Child Containers</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {container.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <Link href={`/${child.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  {child.icon ? (
                    <span className="text-xl flex-shrink-0">{child.icon}</span>
                  ) : (
                    <Package size={18} className="flex-shrink-0" />
                  )}
                  <span className="truncate font-medium">{child.title}</span>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteModal(child.id)}
                  aria-label={`Delete ${child.title}`}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {isBlocksLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {blocks && blocks.length > 0 ? (
            blocks.map((block) => (
              <div
                key={block.id}
                className="p-4 border border-border rounded-md bg-card hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <BlockRenderer block={block} onEdit={(content) => handleUpdateBlock(block.id, content)} />
                    <div className="mt-2 text-xs text-muted-foreground">
                      {block.type} - Updated {new Date(block.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBlock(block.id)}
                    disabled={deleteBlock.isPending}
                    aria-label="Delete block"
                    className="text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No blocks yet</p>
              <Button onClick={() => setShowAddBlock(true)} className="gap-2">
                <Plus size={16} />
                Create your first block
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
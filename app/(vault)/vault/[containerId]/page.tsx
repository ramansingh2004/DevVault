'use client';

import { useContainer } from '@/hooks/useContainers';
import { useBlocks, useCreateBlocks, useUpdateBlocks } from '@/hooks/useBlocks';
import { useParams } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui.components/Button';
import { BlockRenderer } from '@/components/block.components/BlockRenderer';
import { toast } from 'sonner';

export default function ContainerPage() {
  const params = useParams();
  const containerId = params.containerId as string;

  const { data: container, isLoading: isContainerLoading } = useContainer(containerId);
  const { data: blocks, isLoading: isBlocksLoading } = useBlocks(containerId);
  const createBlocks = useCreateBlocks();
  const updateBlocks = useUpdateBlocks();

  const [newBlockType, setNewBlockType] = useState<'heading' | 'paragraph' | 'code' | 'image' | 'link'>('paragraph');
  const [showAddBlock, setShowAddBlock] = useState(false);

  const handleAddBlock = async () => {
    try {
      await createBlocks.mutateAsync({
        container_id: containerId,
        blocks: [
          {
            type: newBlockType,
            content: newBlockType === 'heading' ? 'New heading' : 
                    newBlockType === 'code' ? '// Your code here\n' :
                    'Type something...',
            order_index: blocks?.length || 0,
            meta: newBlockType === 'heading' ? { level: 1 } :
                  newBlockType === 'code' ? { language: 'javascript' } : undefined,
          },
        ],
      });
      toast.success('Block created');
      setShowAddBlock(false);
    } catch (error: any) {
      toast.error('Failed to create block');
    }
  };

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
    } catch (error: any) {
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
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link href="/vault" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span>{container.icon || '📦'}</span>
              {container.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {blocks?.length || 0} blocks • Created{' '}
              {new Date(container.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex gap-2 flex-wrap">
          {showAddBlock ? (
            <div className="flex gap-2">
              <select
                value={newBlockType}
                onChange={(e) => setNewBlockType(e.target.value as any)}
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
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddBlock(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setShowAddBlock(true)} className="gap-2">
              <Plus size={16} />
              Add Block
            </Button>
          )}
        </div>
      </div>

      {/* Blocks */}
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
                <BlockRenderer
                  block={block}
                  onEdit={(content) => handleUpdateBlock(block.id, content)}
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {block.type} • Updated {new Date(block.updated_at).toLocaleDateString()}
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
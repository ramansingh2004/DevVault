'use client';

import { useContainer } from '@/hooks/useContainers';
import { useBlocks } from '@/hooks/useBlocks';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ContainerPage() {
  const params = useParams();
  const containerId = params.containerId as string;

  const { data: container, isLoading: isContainerLoading } = useContainer(containerId);
  const { data: blocks, isLoading: isBlocksLoading } = useBlocks(containerId);

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
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vault" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span>{container.icon || '📦'}</span>
            {container.title}
          </h1>
          <p className="text-muted-foreground">
            {blocks?.length || 0} blocks • Created{' '}
            {new Date(container.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

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
              <div key={block.id} className="p-4 border border-border rounded-md bg-card">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {block.type}
                  </span>
                  <p className="text-sm break-words">{block.content.substring(0, 100)}...</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blocks yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
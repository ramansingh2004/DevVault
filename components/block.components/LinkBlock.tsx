'use client';

import { BlockResponse } from '@/types/api.types';
import { ExternalLink } from 'lucide-react';

interface LinkBlockProps {
  block: BlockResponse;
}

export function LinkBlock({ block }: LinkBlockProps) {
  const url = block.content;
  const title = (block.meta?.title as string) || url;
  const description = (block.meta?.description as string) || '';

  // Ensure URL has protocol
  const fullUrl = url.startsWith('http') ? url : `https://${url}`;

  return (
    <a
      href={fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border border-border rounded-lg hover:bg-accent transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
              {title}
            </h4>
            <ExternalLink size={16} className="flex-shrink-0 text-muted-foreground" />
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2 truncate">{fullUrl}</p>
        </div>
      </div>
    </a>
  );
}
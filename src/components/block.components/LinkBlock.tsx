'use client';

import { BlockResponse } from '@/types/api.types';
import { Button } from '@/components/ui.components/Button';
import { ExternalLink, LinkIcon, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LinkBlockProps {
  block: BlockResponse;
  onEdit?: (content: string) => void;
}

function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export function LinkBlock({ block, onEdit }: LinkBlockProps) {
  const normalizedUrl = normalizeUrl(block.content);
  const title = (block.meta?.title as string) || block.content || 'Untitled link';
  const description = (block.meta?.description as string) || '';
  const [isEditing, setIsEditing] = useState(!normalizedUrl);
  const [url, setUrl] = useState(normalizedUrl || '');

  const handleSave = () => {
    const nextUrl = normalizeUrl(url);

    if (!nextUrl) {
      toast.error('Please enter a valid link');
      return;
    }

    onEdit?.(nextUrl);
    setUrl(nextUrl);
    setIsEditing(false);
    toast.success('Link saved');
  };

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-dashed border-border bg-muted/40 p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <LinkIcon size={16} />
          Link URL
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSave();
              if (event.key === 'Escape' && normalizedUrl) setIsEditing(false);
            }}
            placeholder="https://example.com"
            className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            autoFocus
          />
          <Button type="button" size="sm" onClick={handleSave} className="gap-2">
            <Save size={16} />
            Save Link
          </Button>
        </div>
      </div>
    );
  }

  if (!normalizedUrl) {
    return null;
  }

  return (
    <div className="block rounded-lg border border-border p-4 transition-colors hover:bg-accent group">
      <div className="flex items-start justify-between gap-3">
        <a href={normalizedUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-base font-semibold transition-colors group-hover:text-primary">{title}</h4>
            <ExternalLink size={16} className="flex-shrink-0 text-muted-foreground" />
          </div>
          {description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>}
          <p className="mt-2 truncate text-xs text-muted-foreground">{normalizedUrl}</p>
        </a>
        {onEdit && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
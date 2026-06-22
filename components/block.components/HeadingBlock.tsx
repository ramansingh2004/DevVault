'use client';

import { BlockResponse } from '@/types/api.types';
import { useState } from 'react';

interface HeadingBlockProps {
  block: BlockResponse;
  isEditing?: boolean;
  onEdit?: (content: string) => void;
}

export function HeadingBlock({ block, isEditing = false, onEdit }: HeadingBlockProps) {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [content, setContent] = useState(block.content);

  const level = (block.meta?.level as number) || 1;
  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const handleSave = () => {
    if (onEdit && content.trim()) {
      onEdit(content);
    }
    setIsEditingLocal(false);
  };

  if (isEditingLocal || isEditing) {
    return (
      <div className="space-y-2 p-4 bg-muted/50 rounded-md">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditingLocal(false);
          }}
          className="w-full bg-background border border-input rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditingLocal(true)}
      className="cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
    >
      {HeadingTag === 'h1' && (
        <h1 className="text-3xl font-bold">{content}</h1>
      )}
      {HeadingTag === 'h2' && (
        <h2 className="text-2xl font-bold">{content}</h2>
      )}
      {HeadingTag === 'h3' && (
        <h3 className="text-xl font-bold">{content}</h3>
      )}
      {HeadingTag === 'h4' && (
        <h4 className="text-lg font-bold">{content}</h4>
      )}
      {HeadingTag === 'h5' && (
        <h5 className="text-base font-bold">{content}</h5>
      )}
      {HeadingTag === 'h6' && (
        <h6 className="text-sm font-bold">{content}</h6>
      )}
    </div>
  );
}
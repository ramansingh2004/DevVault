'use client';

import { BlockResponse } from '@/types/api.types';
import { useState } from 'react';

interface ParagraphBlockProps {
  block: BlockResponse;
  isEditing?: boolean;
  onEdit?: (content: string) => void;
}

export function ParagraphBlock({ block, isEditing = false, onEdit }: ParagraphBlockProps) {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [content, setContent] = useState(block.content);

  const handleSave = () => {
    if (onEdit && content.trim()) {
      onEdit(content);
    }
    setIsEditingLocal(false);
  };

  if (isEditingLocal || isEditing) {
    return (
      <div className="space-y-2 p-4 bg-muted/50 rounded-md">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsEditingLocal(false);
            }
          }}
          className="w-full bg-background border border-input rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring resize-none min-h-24"
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
      <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}
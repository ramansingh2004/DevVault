'use client';

import { BlockResponse } from '@/types/api.types';
import { HeadingBlock } from './HeadingBlock';
import { ParagraphBlock } from './ParagraphBlock';
import { CodeBlock } from './CodeBlock';
import { ImageBlock } from './ImageBlock';
import { LinkBlock } from './LinkBlock';

interface BlockRendererProps {
  block: BlockResponse;
  isEditing?: boolean;
  onEdit?: (content: string) => void;
}

export function BlockRenderer({ block, isEditing = false, onEdit }: BlockRendererProps) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock block={block} isEditing={isEditing} onEdit={onEdit} />;
    case 'paragraph':
      return <ParagraphBlock block={block} isEditing={isEditing} onEdit={onEdit} />;
    case 'code':
      return <CodeBlock block={block} isEditing={isEditing} onEdit={onEdit} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'link':
      return <LinkBlock block={block} />;
    default:
      return (
        <div className="p-4 bg-muted rounded-md text-muted-foreground">
          Unknown block type: {block.type}
        </div>
      );
  }
}
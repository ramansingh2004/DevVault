'use client';

import { BlockResponse } from '@/types/api.types';
import Image from 'next/image';

interface ImageBlockProps {
  block: BlockResponse;
}

export function ImageBlock({ block }: ImageBlockProps) {
  const imageUrl = block.content;
  const caption = (block.meta?.caption as string) || '';
  const altText = (block.meta?.alt as string) || 'Image';

  return (
    <figure className="space-y-2">
      <div className="relative w-full h-auto rounded-md overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={altText}
          height={300}
          width={400}
          className="w-full h-auto object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%236b7280" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
            (e.target as HTMLImageElement).style.height = '300px';
          }}
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-muted-foreground text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
'use client';

import { useRef } from 'react';
import { BlockResponse } from '@/types/api.types';
import { useUploadImage } from '@/hooks/useBlocks';
import { Button } from '@/components/ui.components/Button';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageBlockProps {
  block: BlockResponse;
  onEdit?: (content: string) => void;
}

function getImageSrc(content: string): string | null {
  const value = content.trim();

  if (!value) return null;
  if (value.startsWith('/') || value.startsWith('data:image/')) return value;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? value : null;
  } catch {
    return /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(value) ? `/${value}` : null;
  }
}

export function ImageBlock({ block, onEdit }: ImageBlockProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadImage = useUploadImage();
  const imageUrl = getImageSrc(block.content);
  const caption = (block.meta?.caption as string) || '';
  const altText = (block.meta?.alt as string) || 'Image';

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }

    try {
      const { url } = await uploadImage.mutateAsync(file);
      onEdit?.(url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <figure className="space-y-3">
      {imageUrl ? (
        <div className="relative w-full overflow-hidden rounded-md bg-muted">
          <Image
            src={imageUrl}
            alt={altText}
            height={300}
            width={400}
            className="h-auto w-full object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="flex h-[300px] w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted text-sm text-muted-foreground">
          <ImagePlus size={28} />
          <span>Image not available</span>
        </div>
      )}

      {caption && <figcaption className="text-sm text-muted-foreground text-center italic">{caption}</figcaption>}

      {onEdit && (
        <div className="flex justify-center">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => handleUpload(event.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploadImage.isPending}
            className="gap-2"
          >
            <ImagePlus size={16} />
            {uploadImage.isPending ? 'Uploading...' : imageUrl ? 'Replace Image' : 'Upload Image'}
          </Button>
        </div>
      )}
    </figure>
  );
}
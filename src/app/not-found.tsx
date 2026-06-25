'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} />
          Go back home
        </Link>
      </div>
    </div>
  );
}
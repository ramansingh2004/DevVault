'use client';

import { useContainers } from '@/hooks/useContainers';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: containers, isLoading } = useContainers();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your knowledge vault</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          New Container
        </Button>
      </div>

      <div className="grid gap-4">
        {containers && containers.length > 0 ? (
          containers.map((container) => (
            <Link
              key={container.id}
              href={`/vault/${container.id}`}
              className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{container.icon || '📦'}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{container.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(container.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No containers yet</p>
            <Button className="gap-2">
              <Plus size={16} />
              Create your first container
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useContainers } from '@/hooks/useContainers';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui.components/Button';
import { Plus, FolderOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: containers, isLoading } = useContainers();
  const { openCreateModal } = useUIStore();

  const rootContainers = containers?.filter((c) => !c.parent_id) || [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-10 bg-muted rounded-md w-1/3 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          {rootContainers.length === 0
            ? 'Start by creating a new container to organize your knowledge'
            : `You have ${rootContainers.length} container${rootContainers.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button onClick={openCreateModal} size="lg" className="gap-2">
          <Plus size={18} />
          New Container
        </Button>
      </div>

      {/* Containers Grid */}
      {rootContainers.length > 0 ? (
        <div className="space-y-6">
          {/* Grid View */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rootContainers.map((container) => (
              <Link
                key={container.id}
                href={`/vault/${container.id}`}
                className="group p-6 border border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all"
              >
                <div className="space-y-3">
                  {/* Icon & Title */}
                  <div className="space-y-2">
                    <div className="text-4xl">{container.icon || '📦'}</div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {container.title}
                    </h3>
                  </div>

                  {/* Metadata */}
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Created {new Date(container.created_at).toLocaleDateString()}</p>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Open</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-lg">
          <FolderOpen size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No containers yet</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Create your first container to start organizing your knowledge and ideas.
          </p>
          <Button onClick={openCreateModal} size="lg" className="gap-2">
            <Plus size={18} />
            Create Container
          </Button>
        </div>
      )}
    </div>
  );
}
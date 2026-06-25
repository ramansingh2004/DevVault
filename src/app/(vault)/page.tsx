'use client';

import { useContainers } from '@/hooks/useContainers';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui.components/Button';
import { Plus, FolderOpen, ArrowRight, TrendingUp, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { data: containers, isLoading } = useContainers();
  const { openCreateModal } = useUIStore();

  // Get root containers (no parent)
  const rootContainers = containers?.filter((c) => !c.parent_id) || [];

  // Calculate stats
  const stats = useMemo(() => {
    if (!containers) return { total: 0, nested: 0, recent: [] };

    // All containers count
    const total = containers.length;

    // Nested containers (has parent_id)
    const nested = containers.filter((c) => c.parent_id).length;

    // Recent containers (sorted by created_at, last 5)
    const recent = [...containers]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return { total, nested, recent };
  }, [containers]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6 sm:p-8 space-y-8">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded-md w-1/3 animate-pulse" />
            <div className="h-6 bg-muted rounded-md w-2/3 animate-pulse" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-md animate-pulse" />
            ))}
          </div>

          {/* Grid skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 sm:p-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground mt-1">
                {rootContainers.length === 0
                  ? 'Start by creating a new container to organize your knowledge'
                  : `You have ${stats.total} container${stats.total !== 1 ? 's' : ''} in total`}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {rootContainers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Containers */}
            <div className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Containers</p>
                  <p className="text-3xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderOpen size={20} className="text-primary" />
                </div>
              </div>
            </div>

            {/* Root Containers */}
            <div className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Root Containers</p>
                  <p className="text-3xl font-bold mt-1">{rootContainers.length}</p>
                </div>
                <div className="p-2 bg-accent/20 rounded-lg">
                  <TrendingUp size={20} className="text-accent" />
                </div>
              </div>
            </div>

            {/* Nested Containers */}
            <div className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Nested Items</p>
                  <p className="text-3xl font-bold mt-1">{stats.nested}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Zap size={20} className="text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={openCreateModal} size="lg" className="gap-2">
            <Plus size={18} />
            New Container
          </Button>
          {rootContainers.length > 0 && (
            <Link
              href={`/vault/${rootContainers[0].id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50"
            >
              <BookOpen size={18} />
              View Latest
            </Link>
          )}
        </div>

        {/* Main Content */}
        {rootContainers.length > 0 ? (
          <div className="space-y-8">
            {/* Recent Containers Section */}
            {stats.recent.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recently Created</h2>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                </div>
                <div className="grid gap-3">
                  {stats.recent.slice(0, 3).map((container) => (
                    <Link
                      key={container.id}
                      href={`/vault/${container.id}`}
                      className="group p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-accent/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">{container.icon || '📦'}</span>
                        <div className="min-w-0">
                          <p className="font-medium group-hover:text-primary transition-colors truncate">
                            {container.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(container.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Containers Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">All Containers</h2>
                <span className="text-sm text-muted-foreground">{rootContainers.length} items</span>
              </div>
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
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {container.title}
                        </h3>
                      </div>

                      {/* Metadata */}
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          Created{' '}
                          {new Date(container.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                        <span className="text-sm font-medium">Open</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-lg">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">No containers yet</h3>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              Create your first container to start organizing your knowledge and ideas.
            </p>
            <Button onClick={openCreateModal} size="lg" className="gap-2">
              <Plus size={18} />
              Create Your First Container
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
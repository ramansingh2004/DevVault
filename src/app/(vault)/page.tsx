'use client';

import { useContainers, useContainerTrees } from '@/hooks/useContainers';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui.components/Button';
import { Plus, FolderOpen, ArrowRight, TrendingUp, Zap, BookOpen, GitBranch, Package } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import type { ContainerResponse, ContainerTreeResponse } from '@/types/api.types';

export default function DashboardPage() {
  const { data: containers, isLoading } = useContainers();
  const rootContainerIds = useMemo(() => containers?.map((container) => container.id) || [], [containers]);
  const containerTreeQueries = useContainerTrees(rootContainerIds);
  const isTreeLoading = containerTreeQueries.some((query) => query.isLoading);
  const containerTrees = containerTreeQueries.map((query) => query.data).filter((container): container is ContainerTreeResponse => !!container);
  const { openCreateModal } = useUIStore();

  const { allContainers, rootContainers, stats } = useMemo(() => {
    const seen = new Set<string>();
    const flattened: ContainerResponse[] = [];

    const visit = (container: ContainerResponse | ContainerTreeResponse) => {
      if (!seen.has(container.id)) {
        seen.add(container.id);
        flattened.push(container);
      }

      const children = (container as ContainerTreeResponse).children || [];
      children.forEach(visit);
    };

    const sourceContainers = containerTrees.length > 0 ? containerTrees : containers;
    sourceContainers?.forEach(visit);

    const containerIds = new Set(flattened.map((container) => container.id));
    const roots = flattened.filter((container) => !container.parent_id || !containerIds.has(container.parent_id));
    const recent = [...flattened]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      allContainers: flattened,
      rootContainers: roots,
      stats: {
        total: flattened.length,
        nested: flattened.length - roots.length,
        recent,
      },
    };
  }, [containerTrees, containers]);

  const containerById = useMemo(
    () => new Map(allContainers.map((container) => [container.id, container])),
    [allContainers]
  );

  const latestContainer = rootContainers[0] || allContainers[0];

  if (isLoading || isTreeLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="p-6 sm:p-8 space-y-8">
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded-md w-1/3 animate-pulse" />
            <div className="h-6 bg-muted rounded-md w-2/3 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-md animate-pulse" />
            ))}
          </div>

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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground mt-1">
                {allContainers.length === 0
                  ? 'Start by creating a new container to organize your knowledge'
                  : `You have ${stats.total} container${stats.total !== 1 ? 's' : ''} in total`}
              </p>
            </div>
          </div>
        </div>

        {allContainers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            <div className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Nested Containers</p>
                  <p className="text-3xl font-bold mt-1">{stats.nested}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Zap size={20} className="text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => openCreateModal()} size="lg" className="gap-2">
            <Plus size={18} />
            New Container
          </Button>
          {latestContainer && (
            <Link
              href={`/${latestContainer.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50"
            >
              <BookOpen size={18} />
              View Latest
            </Link>
          )}
        </div>

        {rootContainers.length > 0 ? (
          <div className="space-y-8">
            {stats.recent.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recently Created</h2>
                  <span className="text-sm text-muted-foreground">Latest {stats.recent.length}</span>
                </div>
                <div className="grid gap-3">
                  {stats.recent.map((container) => {
                    const parent = container.parent_id ? containerById.get(container.parent_id) : undefined;
                    const isChild = !!parent;

                    return (
                      <Link
                        key={container.id}
                        href={`/${container.id}`}
                        className={`group flex items-center justify-between rounded-lg border p-4 transition-all ${
                          isChild
                            ? 'border-blue-500/20 bg-blue-500/5 pl-6 hover:border-blue-500/50 hover:bg-blue-500/10'
                            : 'border-border bg-card hover:border-primary/50 hover:bg-accent/30'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-muted text-lg">
                            {isChild ? <GitBranch size={20} /> : container.icon || <Package size={18} />}
                          </span>
                          <div className="min-w-0">
                            <div className="mb-1 flex min-w-0 items-center gap-2">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                                  isChild ? 'bg-blue-500/15 text-blue-600' : 'bg-primary/10 text-primary'
                                }`}
                              >
                                {isChild ? 'Child' : 'Parent'}
                              </span>
                              {isChild && parent && (
                                <span className="truncate text-xs text-muted-foreground">Inside {parent.title}</span>
                              )}
                            </div>
                            <p className="truncate font-medium transition-colors group-hover:text-primary">{container.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(container.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={16} className="ml-2 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">All Containers</h2>
                <span className="text-sm text-muted-foreground">{rootContainers.length} items</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rootContainers.map((container) => (
                  <Link
                    key={container.id}
                    href={`/${container.id}`}
                    className="group p-6 border border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="text-4xl">{container.icon || <Package size={36} />}</div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {container.title}
                        </h3>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          Created{' '}
                          {new Date(container.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

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
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-lg">
            <Package size={44} className="mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No containers yet</h3>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              Create your first container to start organizing your knowledge and ideas.
            </p>
            <Button onClick={() => openCreateModal()} size="lg" className="gap-2">
              <Plus size={18} />
              Create Your First Container
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
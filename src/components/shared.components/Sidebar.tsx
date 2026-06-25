'use client';

import { useContainers, useContainerTrees } from '@/hooks/useContainers';
import { useUIStore } from '@/store/ui.store';
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronRight, MoreVertical, Package, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { ContainerTreeResponse } from '@/types/api.types';

interface ContainerNodeProps {
  container: ContainerTreeResponse;
  isExpanded: boolean;
  level: number;
  onToggle: (id: string) => void;
}

function ContainerNode({
  container,
  isExpanded,
  level,
  onToggle,
}: ContainerNodeProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { openDeleteModal, openRenameModal, expandedContainers } = useUIStore();
  const params = useParams();
  const selectedContainerId = params.containerId as string | undefined;
  const isSelected = selectedContainerId === container.id;
  const hasChildren = container.children.length > 0;

  return (
    <div>
      <div
        className={`group flex items-center gap-2 px-2 py-1.5 mx-2 rounded-md hover:bg-accent transition-colors ${
          isSelected ? 'bg-accent' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <button
          type="button"
          onClick={() => onToggle(container.id)}
          disabled={!hasChildren}
          className="p-0 hover:bg-muted rounded inline-flex disabled:opacity-40 disabled:hover:bg-transparent"
          aria-label={isExpanded ? 'Collapse container' : 'Expand container'}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        <Link
          href={`/${container.id}`}
          className="flex-1 flex items-center gap-2 min-w-0"
        >
          {container.icon ? (
            <span className="text-lg flex-shrink-0">{container.icon}</span>
          ) : (
            <Package size={16} className="flex-shrink-0" />
          )}
          <span className="text-sm truncate">{container.title}</span>
        </Link>

        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Open container menu"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-md shadow-md z-50">
              <button
                type="button"
                onClick={() => {
                  openRenameModal(container.id, container.title);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-accent text-foreground"
              >
                Rename
              </button>
              <button
                type="button"
                onClick={() => {
                  openDeleteModal(container.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-destructive/10 text-destructive flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && hasChildren && (
        <>
          {container.children.map((child) => (
            <ContainerNode
              key={child.id}
              container={child}
              isExpanded={expandedContainers.has(child.id)}
              level={level + 1}
              onToggle={onToggle}
            />
          ))}
        </>
      )}
    </div>
  );
}

export function Sidebar() {
  const { data: containers, isLoading } = useContainers();
  const rootContainerIds = useMemo(() => containers?.map((container) => container.id) || [], [containers]);
  const containerTreeQueries = useContainerTrees(rootContainerIds);
  const isTreeLoading = containerTreeQueries.some((query) => query.isLoading);
  const containerTrees = containerTreeQueries.map((query) => query.data).filter((container): container is ContainerTreeResponse => !!container);
  const { sidebarOpen, toggleSidebar, expandedContainers, toggleContainer } = useUIStore();
  const { openCreateModal } = useUIStore();

  const containerTree = useMemo(() => {
    if (containerTrees.length > 0) {
      const sortTree = (items: ContainerTreeResponse[]): ContainerTreeResponse[] =>
        [...items]
          .sort((a, b) => a.order_index - b.order_index)
          .map((item) => ({ ...item, children: sortTree(item.children || []) }));

      return sortTree(containerTrees);
    }

    if (!containers) return [];

    const map = new Map<string, ContainerTreeResponse>();

    // First pass: Create nodes with empty children array
    containers.forEach((c) => {
      map.set(c.id, { ...c, children: [] });
    });

    const roots: ContainerTreeResponse[] = [];

    // Second pass: Associate children with their parents
    containers.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parent_id) {
        const parent = map.get(c.parent_id);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Sort by order_index
    const sortByOrder = (a: ContainerTreeResponse, b: ContainerTreeResponse) => a.order_index - b.order_index;
    roots.sort(sortByOrder);
    map.forEach((node) => {
      node.children.sort(sortByOrder);
    });

    return roots;
  }, [containerTrees, containers]);

  if (!sidebarOpen) return null;

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r border-border bg-[var(--sidebar)]">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">DevVault</h2>
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1 hover:bg-muted rounded"
            aria-label="Close sidebar"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal()}
          className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New Container
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading || isTreeLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : containerTree.length > 0 ? (
          <div className="py-2">
            {containerTree.map((container) => (
              <div key={container.id}>
                <ContainerNode
                  container={container}
                  isExpanded={expandedContainers.has(container.id)}
                  level={0}
                  onToggle={toggleContainer}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">No containers yet</p>
            <button
              type="button"
              onClick={() => openCreateModal()}
              className="mt-3 text-sm text-primary hover:underline font-medium"
            >
              Create one
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
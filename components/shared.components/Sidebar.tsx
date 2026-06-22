'use client';

import { useContainers } from '@/hooks/useContainers';
import { useUIStore } from '@/store/ui.store';
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronRight, MoreVertical, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ContainerResponse } from '@/types/api.types';

interface ContainerNodeProps {
  container: ContainerResponse;
  isSelected: boolean;
  isExpanded: boolean;
  level: number;
  onToggle: (id: string) => void;
}

function ContainerNode({
  container,
  isSelected,
  isExpanded,
  level,
  onToggle,
}: ContainerNodeProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { openDeleteModal, openRenameModal } = useUIStore();

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 mx-2 rounded-md hover:bg-accent transition-colors ${
          isSelected ? 'bg-accent' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <button
          onClick={() => onToggle(container.id)}
          className="p-0 hover:bg-muted rounded inline-flex"
        >
          {isExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        <Link
          href={`/vault/${container.id}`}
          className="flex-1 flex items-center gap-2 min-w-0"
        >
          <span className="text-lg flex-shrink-0">{container.icon || '📦'}</span>
          <span className="text-sm truncate">{container.title}</span>
        </Link>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-md shadow-md z-50">
              <button
                onClick={() => {
                  openRenameModal(container.id, container.title);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-accent text-foreground"
              >
                Rename
              </button>
              <button
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
    </div>
  );
}

export function Sidebar() {
  const { data: containers, isLoading } = useContainers();
  const { sidebarOpen, toggleSidebar, expandedContainers, toggleContainer } = useUIStore();
  const params = useParams();
  const selectedContainerId = params.containerId as string | undefined;
  const { openCreateModal } = useUIStore();

  if (!sidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-14 z-40 p-2 hover:bg-accent rounded-r-md border-r border-border"
      >
        <ChevronRight size={20} />
      </button>
    );
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">DevVault</h2>
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-muted rounded"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New Container
        </button>
      </div>

      {/* Container List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : containers && containers.length > 0 ? (
          <div className="py-2">
            {containers
              .filter((c) => !c.parent_id)
              .map((container) => (
                <div key={container.id}>
                  <ContainerNode
                    container={container}
                    isSelected={selectedContainerId === container.id}
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
              onClick={openCreateModal}
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
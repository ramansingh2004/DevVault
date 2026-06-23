import { useMemo } from 'react';
import { ContainerResponse } from '@/types/api.types';

export interface BreadcrumbItem {
  id: string;
  title: string;
  icon?: string;
}

/**
 * Hook to build breadcrumb path for a container
 * Traverses up the parent chain to create full path
 * 
 * Example:
 * Container tree:
 *   Root
 *     ├── Folder 1
 *     │   └── Document A ← current
 * 
 * Output: [{ id: 'root', title: 'Root' }, { id: 'folder1', title: 'Folder 1' }, { id: 'docA', title: 'Document A' }]
 */
export function useBreadcrumbs(
  containerId: string | undefined,
  containers: ContainerResponse[] | undefined
) {
  return useMemo(() => {
    if (!containerId || !containers) return [];

    const containerMap = new Map<string, ContainerResponse>();
    containers.forEach((c) => containerMap.set(c.id, c));

    const breadcrumbs: BreadcrumbItem[] = [];
    let current = containerMap.get(containerId);

    while (current) {
      breadcrumbs.unshift({
        id: current.id,
        title: current.title,
        icon: current.icon ?? undefined,
      });
      current = current.parent_id ? containerMap.get(current.parent_id) : undefined;
    }

    return breadcrumbs;
  }, [containerId, containers]);
}
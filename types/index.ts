import { BlockResponse, BlockType, ContainerResponse, ContainerTreeResponse, UserResponse } from './api.types';

// Domain models
export interface User extends UserResponse {}

export interface Container extends ContainerResponse {}

export interface ContainerTree extends ContainerTreeResponse {}

export interface Block extends BlockResponse {}

// UI State types
export interface EditorState {
  containerId: string;
  blocks: Block[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  lastSaved: Date | null;
}

export interface SidebarState {
  isOpen: boolean;
  expandedContainers: Set<string>;
  selectedContainerId: string | null;
}

export interface UIState {
  sidebar: SidebarState;
  theme: 'light' | 'dark' | 'system';
  showCreateModal: boolean;
  showDeleteModal: boolean;
  showRenameModal: boolean;
}

// Modal types
export interface CreateContainerModal {
  isOpen: boolean;
  parentId?: string;
}

export interface RenameContainerModal {
  isOpen: boolean;
  containerId?: string;
  currentTitle: string;
}

export interface DeleteContainerModal {
  isOpen: boolean;
  containerId?: string;
  title: string;
}
import { create } from 'zustand';

interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  expandedContainers: Set<string>;

  // Modals
  createModalOpen: boolean;
  deleteModalOpen: boolean;
  renameModalOpen: boolean;
  settingsModalOpen: boolean;

  // Modal data
  selectedContainerId: string | null;
  renameContainerTitle: string;

  // Theme
  theme: 'light' | 'dark' | 'system';

  // Actions
  toggleSidebar: () => void;
  toggleContainer: (containerId: string) => void;
  setExpandedContainers: (containers: Set<string>) => void;

  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openDeleteModal: (containerId: string) => void;
  closeDeleteModal: () => void;
  openRenameModal: (containerId: string, title: string) => void;
  closeRenameModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;

  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  sidebarOpen: true,
  expandedContainers: new Set(),
  createModalOpen: false,
  deleteModalOpen: false,
  renameModalOpen: false,
  settingsModalOpen: false,
  selectedContainerId: null,
  renameContainerTitle: '',
  theme: 'system',

  // Sidebar
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleContainer: (containerId) =>
    set((state) => {
      const newExpanded = new Set(state.expandedContainers);
      if (newExpanded.has(containerId)) {
        newExpanded.delete(containerId);
      } else {
        newExpanded.add(containerId);
      }
      return { expandedContainers: newExpanded };
    }),
  setExpandedContainers: (containers) => set({ expandedContainers: containers }),

  // Modal actions
  openCreateModal: () => set({ createModalOpen: true }),
  closeCreateModal: () => set({ createModalOpen: false }),
  openDeleteModal: (containerId) => set({ deleteModalOpen: true, selectedContainerId: containerId }),
  closeDeleteModal: () => set({ deleteModalOpen: false, selectedContainerId: null }),
  openRenameModal: (containerId, title) =>
    set({ renameModalOpen: true, selectedContainerId: containerId, renameContainerTitle: title }),
  closeRenameModal: () => set({ renameModalOpen: false, selectedContainerId: null }),
  openSettingsModal: () => set({ settingsModalOpen: true }),
  closeSettingsModal: () => set({ settingsModalOpen: false }),

  // Theme
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(state.theme);
      const newTheme = themes[(currentIndex + 1) % themes.length];
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
      return { theme: newTheme };
    }),
}));
'use client';

import { useAuth, useLogout } from '@/hooks/useAuth';
import { useUIStore } from '@/store/ui.store';
import { useRouter } from 'next/navigation';
import { Search, LogOut, Settings, Moon, Sun, Menu, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function Navbar() {
  const { data: user } = useAuth();
  const logout = useLogout();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar, theme, setTheme } = useUIStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Failed to logout');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      toast.info('Search coming soon!');
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        {!sidebarOpen ? (
          <div className="flex items-center gap-2 border-r border-border pr-4">
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1 hover:bg-muted rounded"
              aria-label="Open sidebar"
            >
              <ChevronRight size={20} />
            </button>
            <span className="font-bold text-lg">DevVault</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleSidebar}
            className="lg:hidden p-1 hover:bg-muted rounded"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search containers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </form>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 hover:bg-muted rounded-md transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md transition-colors"
          >
            <div className="flex flex-col items-end gap-0">
              <span className="text-sm font-medium">{user?.email?.split('@')[0]}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Joined {new Date(user?.created_at || '').toLocaleDateString()}</p>
              </div>

              <button
                className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 transition-colors"
                onClick={() => {
                  router.push('/settings');
                  setShowUserMenu(false);
                }}
              >
                <Settings size={16} />
                Settings
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setShowUserMenu(false);
                }}
                disabled={logout.isPending}
                className="w-full px-4 py-2 text-sm text-left hover:bg-destructive/10 text-destructive flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <LogOut size={16} />
                {logout.isPending ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
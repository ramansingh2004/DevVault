'use client';

import { useAuth, useLogout } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui.components/Button';
import { Label } from '@/components/ui.components/Label';
import { ArrowLeft, LogOut, Moon, Sun, Monitor } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data: user } = useAuth();
  const logout = useLogout();
  const router = useRouter();
  const { theme, setTheme } = useUIStore();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Failed to logout');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* Account Section */}
      <section className="space-y-4 border-b border-border pb-6">
        <h2 className="text-xl font-bold">Account</h2>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-muted-foreground">Email</Label>
            <p className="text-base font-medium mt-1">{user.email}</p>
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground">Member Since</Label>
            <p className="text-base font-medium mt-1">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="space-y-4 border-b border-border pb-6">
        <h2 className="text-xl font-bold">Appearance</h2>
        
        <div>
          <Label className="text-sm text-muted-foreground block mb-3">Theme</Label>
          <div className="flex gap-2">
            {[
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'system', label: 'System', icon: Monitor },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value as 'light' | 'dark' | 'system')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  theme === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-destructive">Danger Zone</h2>
        
        <p className="text-sm text-muted-foreground">
          Once you log out, you will need to sign in again with your email and password.
        </p>
        
        <Button
          variant="destructive"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full gap-2"
        >
          <LogOut size={16} />
          {logout.isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </section>
    </div>
  );
}
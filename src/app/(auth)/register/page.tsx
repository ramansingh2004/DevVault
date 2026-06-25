'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui.components/Button';
import { Input } from '@/components/ui.components/Input';
import { Label } from '@/components/ui.components/Label';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error';

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await register.mutateAsync({ email, password });
      toast.success('Account created successfully');
      router.push('/vault');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Registration failed'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-muted-foreground">Join DevVault and organize your knowledge</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
    </div>
  );
}
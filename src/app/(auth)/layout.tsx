import AuthBackground from "@/components/animations.components/AuthBackground";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-theme-root relative min-h-screen flex items-center justify-center overflow-hidden bg-background text-foreground">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
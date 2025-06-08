import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md rounded-lg bg-white/90 p-8 shadow-xl dark:bg-black/80">
        {children}
      </div>
    </div>
  );
}

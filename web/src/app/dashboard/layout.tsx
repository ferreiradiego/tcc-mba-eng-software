import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-muted/50 p-6">{children}</main>
    </div>
  );
}

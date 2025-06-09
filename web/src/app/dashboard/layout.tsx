import { Sidebar } from "@/components/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen h-screen w-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-screen overflow-auto bg-muted/50 p-6">
        {children}
      </main>
    </div>
  );
}

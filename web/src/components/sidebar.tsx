import { Home, ListChecks, Timer, Users, FileText, Settings } from "lucide-react";
import Link from "next/link";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/tasks", label: "Tarefas", icon: ListChecks },
  { href: "/dashboard/timelogs", label: "Tempo", icon: Timer },
  { href: "/dashboard/ceremonies", label: "Cerimônias", icon: Users },
  { href: "/dashboard/reports", label: "Relatórios", icon: FileText },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-background border-r h-screen p-4 flex flex-col gap-2">
      <div className="font-bold text-lg mb-6">Dev Productivity</div>
      <nav className="flex flex-col gap-2">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-2 rounded px-3 py-2 hover:bg-muted transition-colors">
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
        <Link href="/logout" className="flex items-center gap-2 rounded px-3 py-2 text-red-500 hover:bg-muted transition-colors mt-8">
          <span>Sair</span>
        </Link>
      </nav>
    </aside>
  );
}

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  FileText,
  Home,
  ListChecks,
  LogOut,
  Settings,
  User2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  {
    href: "/dashboard/trimesters",
    label: "Trimestres & Sprints",
    icon: ListChecks,
  },
  { href: "/dashboard/user-stories", label: "User Stories", icon: FileText },
  { href: "/dashboard/tasks", label: "Tarefas", icon: ListChecks },
  { href: "/dashboard/ceremonies", label: "Cerimônias", icon: Users },
  { href: "/dashboard/reports", label: "Relatórios", icon: FileText },
];

export function Sidebar() {
  const { user, isLoading } = useCurrentUser();

  return (
    <aside className="w-64 bg-background border-r h-screen p-4 flex flex-col gap-4">
      <div className="flex justify-center">
        <Logo />
      </div>
      <div className="mb-2 text-sm">
        {isLoading ? (
          <Skeleton className="h-16 w-full rounded-lg" />
        ) : user ? (
          <div className="flex items-center gap-3 bg-muted rounded-lg p-3 mb-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user.name?.[0]?.toUpperCase() || (
                        <User2 className="w-6 h-6" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 mt-2">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Perfil & Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/reports">Meus Relatórios</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/tasks">Minhas Tarefas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/logout"
                    className="text-red-500 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {user.email}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 rounded px-3 py-2 hover:bg-accent focus:bg-accent transition-colors group"
          >
            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            <span className="truncate text-sm">{label}</span>
          </Link>
        ))}
        <div className="border-t my-4 border-border" />
      </nav>
      <Link
        href="/logout"
        className="flex items-center gap-2 rounded px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors mt-2 group w-full"
      >
        <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600" />
        <span>Sair</span>
      </Link>
    </aside>
  );
}

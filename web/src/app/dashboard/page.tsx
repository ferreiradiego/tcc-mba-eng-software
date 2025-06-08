export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards de resumo: tarefas, tempo, cerimônias, etc. */}
        <div className="rounded-lg bg-white dark:bg-black/80 p-6 shadow">
          <div className="text-muted-foreground text-sm">Tarefas</div>
          <div className="text-2xl font-bold">--</div>
        </div>
        <div className="rounded-lg bg-white dark:bg-black/80 p-6 shadow">
          <div className="text-muted-foreground text-sm">Tempo Registrado</div>
          <div className="text-2xl font-bold">--</div>
        </div>
        <div className="rounded-lg bg-white dark:bg-black/80 p-6 shadow">
          <div className="text-muted-foreground text-sm">Cerimônias</div>
          <div className="text-2xl font-bold">--</div>
        </div>
      </div>
      {/* Gráficos, listas, etc. */}
    </div>
  );
}

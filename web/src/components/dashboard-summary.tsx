"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useReportApi } from "@/hooks/use-report-api";
import { Trimester, useTrimesters } from "@/hooks/use-trimesters";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#f59e42",
  "#10b981",
  "#ef4444",
  "#a21caf",
  "#fbbf24",
];

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

type Task = {
  id: string;
  title?: string;
  name?: string;
  status?: string;
  createdAt?: string;
};

type Ceremony = {
  id: string;
  type: string;
  scheduledAt?: string;
};

export default function DashboardSummary() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { trimesters, loading: loadingTrimesters } = useTrimesters();

  const defaultTrimesterId =
    trimesters.length > 0 ? trimesters[trimesters.length - 1].id : "";

  const [dateFromObj, setDateFromObj] = useState<Date>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [dateToObj, setDateToObj] = useState<Date>(new Date());
  const [selectedTrimester, setSelectedTrimester] =
    useState<string>(defaultTrimesterId);

  const dateFrom = formatDate(dateFromObj);
  const dateTo = formatDate(dateToObj);

  const selectedTrimesterObj: Trimester | undefined = useMemo(() => {
    return (
      trimesters.find((t: Trimester) => t.id === selectedTrimester) ||
      trimesters[trimesters.length - 1]
    );
  }, [selectedTrimester, trimesters]);

  const { summary } = useReportApi(
    user?.id,
    selectedTrimesterObj?.year,
    selectedTrimesterObj?.number
  );

  const filteredTasks: Task[] = useMemo(() => {
    if (!summary.data?.data.tasks) return [];
    return (summary.data.data.tasks as Task[]).filter((t) => {
      if (!t.createdAt) return true;
      const d = new Date(t.createdAt);
      return d >= new Date(dateFrom) && d <= new Date(dateTo);
    });
  }, [summary.data, dateFrom, dateTo]);

  const filteredCeremonies: Ceremony[] = useMemo(() => {
    if (!summary.data?.data.ceremonies) return [];
    return (summary.data.data.ceremonies as Ceremony[]).filter((c) => {
      if (!c.scheduledAt) return true;
      const d = new Date(c.scheduledAt);
      return d >= new Date(dateFrom) && d <= new Date(dateTo);
    });
  }, [summary.data, dateFrom, dateTo]);

  const tasksByDay = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTasks.forEach((t) => {
      const d = t.createdAt ? formatDate(new Date(t.createdAt)) : "";
      if (d) map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map).map(([date, value]) => ({ date, value }));
  }, [filteredTasks]);

  const statusMap = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTasks.forEach((t) => {
      const status = t.status || "Outro";
      map[status] = (map[status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTasks]);

  const totalTasks = filteredTasks.length;
  const totalCeremonies = filteredCeremonies.length;
  const chartData = [
    { name: "Tarefas", value: totalTasks },
    { name: "Cerimônias", value: totalCeremonies },
  ];

  const taskRows = filteredTasks.slice(0, 5).map((t) => (
    <tr key={t.id} className="border-b">
      <td className="px-2 py-1 text-sm">{t.title || t.name || t.id}</td>
      <td className="px-2 py-1 text-xs text-muted-foreground">
        {t.status || "-"}
      </td>
      <td className="px-2 py-1 text-xs text-muted-foreground">
        {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}
      </td>
    </tr>
  ));

  const ceremonyRows = filteredCeremonies.slice(0, 5).map((c) => (
    <tr key={c.id} className="border-b">
      <td className="px-2 py-1 text-sm">{c.type}</td>
      <td className="px-2 py-1 text-xs text-muted-foreground">
        {c.scheduledAt ? new Date(c.scheduledAt).toLocaleDateString() : "-"}
      </td>
    </tr>
  ));

  if (userLoading || summary.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Select
          value={selectedTrimester || defaultTrimesterId}
          onValueChange={setSelectedTrimester}
          disabled={loadingTrimesters || trimesters.length === 0}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o trimestre" />
          </SelectTrigger>
          <SelectContent>
            {trimesters.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.year} - {t.number}º trimestre
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 border rounded px-2 py-1 text-sm bg-background hover:bg-accent transition">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <span>De: {format(dateFromObj, "dd/MM/yyyy")}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFromObj}
              onSelect={(d) => d && setDateFromObj(d)}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 border rounded px-2 py-1 text-sm bg-background hover:bg-accent transition">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <span>Até: {format(dateToObj, "dd/MM/yyyy")}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateToObj}
              onSelect={(d) => d && setDateToObj(d)}
            />
          </PopoverContent>
        </Popover>
        <span className="text-xs text-muted-foreground">
          ({filteredTasks.length} tarefas, {filteredCeremonies.length}{" "}
          cerimônias)
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-lg p-6 shadow flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-950">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span className="font-bold text-2xl">{totalTasks}</span>{" "}
            <span className="text-sm">Tarefas</span>
          </div>
        </Card>
        <Card className="rounded-lg p-6 shadow flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-950">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <span className="font-bold text-2xl">{totalCeremonies}</span>{" "}
            <span className="text-sm">Cerimônias</span>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 flex flex-col items-center">
          <div className="font-semibold mb-2">Distribuição Geral</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={40}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Bar dataKey="value">
                {chartData.map((entry, idx) => (
                  <Cell
                    key={`bar-cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Bar>
              <RechartsTooltip />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <div className="font-semibold mb-2">Status das Tarefas</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusMap}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusMap.map((entry, idx) => (
                  <Cell
                    key={`cell-status-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 flex flex-col items-center">
          <div className="font-semibold mb-2">Tarefas Criadas por Dia</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={tasksByDay}
              margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <RechartsTooltip />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <div className="font-semibold mb-2">Resumo Visual</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, idx) => (
                  <Cell
                    key={`cell-main-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 overflow-x-auto">
          <div className="font-semibold mb-2">Tarefas Recentes</div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-1">Título</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Criada em</th>
              </tr>
            </thead>
            <tbody>
              {taskRows.length > 0 ? (
                taskRows
              ) : (
                <tr>
                  <td colSpan={3} className="text-muted-foreground text-center">
                    Nenhuma tarefa
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
        <Card className="p-4 overflow-x-auto">
          <div className="font-semibold mb-2">Próximas Cerimônias</div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-1">Tipo</th>
                <th className="px-2 py-1">Data</th>
              </tr>
            </thead>
            <tbody>
              {ceremonyRows.length > 0 ? (
                ceremonyRows
              ) : (
                <tr>
                  <td colSpan={2} className="text-muted-foreground text-center">
                    Nenhuma cerimônia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

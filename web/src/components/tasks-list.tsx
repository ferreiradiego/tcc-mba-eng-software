"use client";

import { TaskDialogForm } from "@/components/task-dialog-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { useTasks, type Task } from "@/hooks/use-tasks";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { cn } from "@/lib/utils";
import {
  addDays,
  format,
  format as formatDate,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FilePen,
  PlayCircle,
  Timer,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

function formatMinutes(min: number) {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h${m > 0 ? ` ${m}m` : ""}`;
  }
  return `${min}m`;
}

function getDuration(task: Task) {
  if (task.startedAt && task.finishedAt) {
    const start = new Date(task.startedAt).getTime();
    const end = new Date(task.finishedAt).getTime();
    if (!isNaN(start) && !isNaN(end) && end > start) {
      return Math.round((end - start) / 60000);
    }
  }
  return null;
}

const TASK_STATUS_MAP: Record<
  string,
  { icon: JSX.Element; badgeColor: string; label: string }
> = {
  TODO: {
    icon: <Clock className="w-4 h-4 text-blue-500" />,
    badgeColor: "bg-blue-100 text-blue-800",
    label: "A Fazer",
  },
  IN_PROGRESS: {
    icon: <PlayCircle className="w-4 h-4 text-yellow-500" />,
    badgeColor: "bg-yellow-100 text-yellow-800",
    label: "Em Progresso",
  },
  DONE: {
    icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
    badgeColor: "bg-green-100 text-green-800",
    label: "Concluída",
  },
};

export default function TasksList() {
  const { tasks, loading, error, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { filters, clearFilters, updatePath } = useUrlFilters([
    "status",
    "type",
    "dateFrom",
    "dateTo",
  ]);

  const [statusFilter, setStatusFilter] = useState<string>(
    filters.status || "ALL"
  );
  const [typeFilter, setTypeFilter] = useState<string>(filters.type || "ALL");
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>(() => {
    const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const to = filters.dateTo ? new Date(filters.dateTo) : null;
    return { from, to };
  });

  useEffect(() => {
    const { from, to } = dateRange;
    const query: Record<string, string> = {};
    if (statusFilter && statusFilter !== "ALL") query.status = statusFilter;
    if (typeFilter && typeFilter !== "ALL") query.type = typeFilter;
    if (from) query.dateFrom = from.toISOString().slice(0, 10);
    if (to) query.dateTo = to.toISOString().slice(0, 10);
    const params = new URLSearchParams(query).toString();
    updatePath(params);
  }, [statusFilter, typeFilter, dateRange, updatePath]);

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === "ALL" || task.status === statusFilter;
    const typeMatch = typeFilter === "ALL" || task.type === typeFilter;
    const startedDate = task.startedAt ? new Date(task.startedAt) : null;
    let dateMatch = true;
    if (dateRange.from && dateRange.to && startedDate) {
      dateMatch =
        (isSameDay(startedDate, dateRange.from) ||
          isAfter(startedDate, dateRange.from)) &&
        (isSameDay(startedDate, dateRange.to) ||
          isBefore(startedDate, addDays(dateRange.to, 1)));
    } else if (dateRange.from && startedDate) {
      dateMatch =
        isSameDay(startedDate, dateRange.from) ||
        isAfter(startedDate, dateRange.from);
    }
    return statusMatch && typeMatch && dateMatch;
  });

  const grouped = filteredTasks.reduce((acc: Record<string, Task[]>, task) => {
    const date = task.startedAt
      ? new Date(task.startedAt).toLocaleDateString()
      : "Sem data";
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    if (a === "Sem data") return 1;
    if (b === "Sem data") return -1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const TASK_TYPE_LABELS: Record<string, string> = {
    BUG: "Bug",
    IMPROVEMENT: "Melhoria",
    FEATURE: "Funcionalidade",
    CODE_REVIEW: "Revisão de Código",
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="TODO">A Fazer</SelectItem>
              <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
              <SelectItem value="DONE">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os tipos</SelectItem>
              <SelectItem value="BUG">Bug</SelectItem>
              <SelectItem value="IMPROVEMENT">Melhoria</SelectItem>
              <SelectItem value="FEATURE">Funcionalidade</SelectItem>
              <SelectItem value="CODE_REVIEW">Revisão de Código</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[220px] justify-start text-left font-normal",
                  !dateRange.from && !dateRange.to && "text-muted-foreground"
                )}
              >
                {dateRange.from && dateRange.to
                  ? `${formatDate(dateRange.from, "P", {
                      locale: ptBR,
                    })} - ${formatDate(dateRange.to, "P", { locale: ptBR })}`
                  : dateRange.from
                  ? formatDate(dateRange.from, "P", { locale: ptBR })
                  : "Filtrar por período"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={
                  dateRange.from && dateRange.to
                    ? { from: dateRange.from, to: dateRange.to }
                    : undefined
                }
                onSelect={(range) =>
                  setDateRange({
                    from: range?.from ?? null,
                    to: range?.to ?? null,
                  })
                }
                required={false}
              />
              {(dateRange.from || dateRange.to) && (
                <Button
                  variant="ghost"
                  className="mt-2 w-full"
                  onClick={() => {
                    setDateRange({ from: null, to: null });
                    clearFilters();
                  }}
                >
                  Limpar período
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant="ghost"
          className="h-9"
          onClick={() => {
            setStatusFilter("ALL");
            setTypeFilter("ALL");
            setDateRange({ from: null, to: null });
            clearFilters();
          }}
        >
          Limpar todos os filtros
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <Skeleton className="h-5 w-1/3 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedDates.map((date) => (
            <div
              key={date}
              className="rounded-lg border bg-white/80 dark:bg-zinc-900/80 shadow p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-base text-muted-foreground">
                  {date !== "Sem data"
                    ? format(new Date(date), "P", { locale: ptBR })
                    : date}
                </span>
                <Badge variant="secondary">
                  {grouped[date].length} tarefas
                </Badge>
              </div>
              <div className="divide-y">
                {grouped[date].map((task) => {
                  const status =
                    TASK_STATUS_MAP[task.status] || TASK_STATUS_MAP["TODO"];
                  return (
                    <div
                      key={task.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0 hover:bg-muted/40 rounded transition"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {status.icon}
                        <span className="font-medium truncate">
                          {task.title}
                          {task?.userStory && (
                            <span className="ml-2 text-xs text-muted-foreground bg-gray-100 rounded px-2 py-0.5">
                              {task?.userStory?.title}
                            </span>
                          )}
                        </span>
                        <Badge className={status.badgeColor + " ml-2"}>
                          {status.label}
                        </Badge>

                        {task.type && (
                          <Badge className="bg-gray-100 text-gray-800 ml-2 flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            {TASK_TYPE_LABELS[task.type] || task.type}
                          </Badge>
                        )}

                        {getDuration(task) !== null && (
                          <span className="ml-2 text-sm text-purple-700 font-semibold flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Duração:{" "}
                            {getDuration(task) !== null
                              ? formatMinutes(getDuration(task)!)
                              : "-"}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTask(task)}
                        >
                          <FilePen />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-muted-foreground text-center py-8">
              Nenhuma tarefa encontrada.
            </div>
          )}
        </div>
      )}

      {editingTask && (
        <TaskDialogForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </>
  );
}

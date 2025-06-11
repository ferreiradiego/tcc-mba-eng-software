"use client";

import { TaskDialogForm } from "@/components/task-dialog-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useTasks, type Task } from "@/hooks/use-tasks";
import {
  FilePen,
  Trash2,
  CalendarDays,
  CheckCircle2,
  PlayCircle,
  Clock,
  Timer,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

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

export default function TasksList() {
  const { tasks, loading, error, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const grouped = tasks.reduce((acc: Record<string, Task[]>, task) => {
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
        <div className="flex flex-col gap-8">
          {sortedDates.map((date) => (
            <div
              key={date}
              className="rounded-lg border bg-white/80 dark:bg-zinc-900/80 shadow p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-base text-muted-foreground">
                  {date}
                </span>
                <Badge variant="secondary">
                  {grouped[date].length} tarefas
                </Badge>
              </div>
              <div className="divide-y">
                {grouped[date].map((task) => {
                  let statusIcon = <Clock className="w-4 h-4 text-blue-500" />;
                  let badgeColor = "bg-blue-100 text-blue-800";
                  let statusLabel = "A Fazer";
                  if (task.status === "IN_PROGRESS") {
                    statusIcon = (
                      <PlayCircle className="w-4 h-4 text-yellow-500" />
                    );
                    badgeColor = "bg-yellow-100 text-yellow-800";
                    statusLabel = "Em Progresso";
                  } else if (task.status === "DONE") {
                    statusIcon = (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    );
                    badgeColor = "bg-green-100 text-green-800";
                    statusLabel = "Concluída";
                  }
                  return (
                    <div
                      key={task.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0 hover:bg-muted/40 rounded transition"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {statusIcon}
                        <span className="font-medium truncate">
                          {task.title}
                          {task?.userStory && (
                            <span className="ml-2 text-xs text-muted-foreground bg-gray-100 rounded px-2 py-0.5">
                              {task?.userStory?.title}
                            </span>
                          )}
                        </span>
                        <Badge className={badgeColor + " ml-2"}>
                          {statusLabel}
                        </Badge>

                        {task.type && (
                          <Badge className="bg-gray-100 text-gray-800 ml-2 flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            {TASK_TYPE_LABELS[task.type] || task.type}
                          </Badge>
                        )}

                        {/* Duração fora do badge, mais amigável */}
                        {getDuration(task) !== null && (
                          <span className="ml-2 text-sm text-purple-700 font-semibold flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Duração:{" "}
                            {getDuration(task) !== null
                              ? formatMinutes(getDuration(task)!)
                              : "-"}
                          </span>
                        )}
                        {/* Desvio de tempo */}
                        {typeof task.estimatedTime === "number" &&
                          getDuration(task) !== null && (
                            <Badge
                              className={`ml-2 flex items-center gap-1 ${
                                (getDuration(task) ?? 0) > task.estimatedTime
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                              title="Desvio de tempo"
                            >
                              <AlertCircle className="w-3 h-3" />
                              {(getDuration(task) ?? 0) > task.estimatedTime
                                ? `+${formatMinutes(
                                    (getDuration(task) ?? 0) -
                                      task.estimatedTime
                                  )}`
                                : `${formatMinutes(
                                    (getDuration(task) ?? 0) -
                                      task.estimatedTime
                                  )}`}
                            </Badge>
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

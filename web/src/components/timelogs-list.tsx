"use client";

import { Button } from "@/components/ui/button";
import { useTimeLogs, TimeLog } from "@/hooks/use-timelogs";
import { useTasks } from "@/hooks/use-tasks";
import { useState } from "react";
import { TimeLogDialogForm } from "@/components/timelog-dialog-form";
import { Clock, PauseCircle, StopCircle, FilePen, Trash2 } from "lucide-react";

export default function TimeLogsList() {
  const { timelogs, loading, error, deleteTimeLog } = useTimeLogs();
  const { tasks } = useTasks();
  const [editingTimeLog, setEditingTimeLog] = useState<TimeLog | null>(null);
  const statusMap: Record<string, string> = {
    running: "Em andamento",
    paused: "Pausado",
    stopped: "Finalizado",
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 bg-card rounded-lg p-4 border animate-pulse">
              <div className="h-12 w-12 bg-muted rounded-full" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-3 w-1/3 bg-muted rounded" />
                <div className="h-3 w-1/4 bg-muted rounded" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-8 w-8 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {timelogs.map((timelog) => {
            const task = tasks.find((t) => t.id === timelog.taskId);
            let statusIcon = <Clock className="text-blue-500" />;
            let statusColor = "text-blue-600";
            if (timelog.status === "paused") {
              statusIcon = <PauseCircle className="text-yellow-500" />;
              statusColor = "text-yellow-600";
            } else if (timelog.status === "stopped") {
              statusIcon = <StopCircle className="text-red-500" />;
              statusColor = "text-red-600";
            }
            return (
              <div
                key={timelog.id}
                className="flex items-center gap-4 bg-card rounded-lg p-4 shadow-sm border"
              >
                <div>{statusIcon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {task ? task.title : (
                      <span className="italic text-muted-foreground">(Tarefa não encontrada)</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Início: {timelog.startTime ? new Date(timelog.startTime).toLocaleString() : "-"}
                    {timelog.endTime && (
                      <>
                        {" | Fim: "}
                        {new Date(timelog.endTime).toLocaleString()}
                      </>
                    )}
                  </div>
                  <div className="text-xs mt-1">
                    <span className={statusColor + " font-semibold"}>{statusMap[timelog.status] || timelog.status}</span>
                    {timelog.duration && (
                      <span className="ml-2 text-muted-foreground">Duração: {timelog.duration} min</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingTimeLog(timelog)}
                    aria-label="Editar"
                  >
                    <FilePen />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteTimeLog(timelog.id)}
                    aria-label="Excluir"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            );
          })}
          {timelogs.length === 0 && (
            <div className="text-muted-foreground text-center py-8">
              Nenhum registro encontrado.
            </div>
          )}
        </div>
      )}
      {editingTimeLog && (
        <TimeLogDialogForm
          timelog={editingTimeLog}
          onClose={() => setEditingTimeLog(null)}
        />
      )}
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </>
  );
}

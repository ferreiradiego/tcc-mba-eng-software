"use client";

import { TaskDialogForm } from "@/components/task-dialog-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks, type Task } from "@/hooks/use-tasks";
import { FilePen, Trash2 } from "lucide-react";
import { useState } from "react";

export default function TasksList() {
  const { tasks, loading, error, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
        <div className="divide-y">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="py-2 flex items-center justify-between"
            >
              <span className="font-medium">{task.title}</span>
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

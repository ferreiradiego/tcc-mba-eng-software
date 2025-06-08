import { TaskDialogForm } from "@/components/task-dialog-form";
import TasksList from "@/components/tasks-list";
import { Card } from "@/components/ui/card";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tarefas</h2>
        <TaskDialogForm />
      </div>
      <Card className="p-4">
        <TasksList />
      </Card>
    </div>
  );
}

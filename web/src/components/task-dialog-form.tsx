"use client";

import {
  ControlledDatePicker,
  ControlledInput,
  ControlledSelect,
  ControlledTextArea,
} from "@/components/controlled-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Task, useTasks } from "@/hooks/use-tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(2, "Título obrigatório"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string().optional(),
  dueDate: z.coerce.date().optional(),
});
type TaskForm = z.infer<typeof TaskSchema>;

export function TaskDialogForm({
  task,
  onClose,
}: {
  task?: Task;
  onClose?: () => void;
}) {
  const isEdit = !!task;
  const [open, setOpen] = useState(false);
  const { createTask, updateTask } = useTasks();
  const { user } = useCurrentUser();
  const methods = useForm<TaskForm>({
    resolver: zodResolver(TaskSchema),
    defaultValues: task
      ? {
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }
      : {
          status: "todo",
          priority: "medium",
        },
  });

  useEffect(() => {
    if (isEdit && task) {
      setOpen(true);
      methods.reset({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      });
    }
  }, [task]);

  useEffect(() => {
    if (!open && isEdit) {
      methods.reset();
    }
  }, [open]);

  async function onSubmit(data: TaskForm) {
    if (!user?.id) return;
    const payload = {
      ...data,
      userId: user.id,
    };
    if (isEdit && task) {
      await updateTask({ id: task.id, data: payload });
    } else {
      await createTask(payload);
    }
    methods.reset();
    setOpen(false);
    onClose?.();
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {!isEdit && (
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
            <PlusIcon />
            Adicionar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
        </DialogHeader>
        {methods.formState.isSubmitting ? (
          <div className="py-8 text-center text-muted-foreground">
            Salvando tarefa...
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <ControlledInput name="title" label="Título" required />
              <ControlledTextArea name="description" label="Descrição" />
              <ControlledSelect
                name="status"
                label="Status"
                required
                options={[
                  { value: "todo", label: "A Fazer" },
                  { value: "in_progress", label: "Em Progresso" },
                  { value: "done", label: "Concluída" },
                ]}
              />
              <ControlledSelect
                name="priority"
                label="Prioridade"
                required
                options={[
                  { value: "low", label: "Baixa" },
                  { value: "medium", label: "Média" },
                  { value: "high", label: "Alta" },
                ]}
              />
              <ControlledInput name="category" label="Categoria" />
              <ControlledDatePicker name="dueDate" label="Prazo" />

              <Button
                type="submit"
                disabled={methods.formState.isSubmitting}
                className="w-full"
              >
                {methods.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}

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
import { Task, TaskStatus, useTasks } from "@/hooks/use-tasks";
import { useUserStories } from "@/hooks/use-user-stories";
import { TASK_STATUS, TASK_TYPE } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(2, "Título obrigatório"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  dueDate: z.coerce.date().optional(),
  userStoryId: z.string().optional(),
  type: z.string(),
  estimatedTime: z.coerce.number().int().positive().optional(),
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
  const { userStories } = useUserStories();
  const methods = useForm<TaskForm>({
    resolver: zodResolver(TaskSchema),
    defaultValues: task
      ? {
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          userStoryId:
            (task as any).userStoryId ||
            (task as any).userStory?.id ||
            undefined,
        }
      : {
          status: TaskStatus.TODO,
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
                options={TASK_STATUS}
                required
              />
              <ControlledSelect
                name="type"
                label="Tipo"
                options={TASK_TYPE}
                required
              />
              <ControlledDatePicker name="dueDate" label="Data de entrega" />
              <ControlledInput
                name="estimatedTime"
                label="Tempo estimado (min)"
                type="number"
              />
              <ControlledSelect
                name="userStoryId"
                label="User Story"
                options={userStories.map((us) => ({
                  value: us.id,
                  label: us.title,
                }))}
              />
              {/* Campos de tempo removidos do formulário, pois são setados automaticamente pelo backend */}
              <Button
                type="submit"
                disabled={methods.formState.isSubmitting}
                className="w-full"
              >
                {methods.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : isEdit ? (
                  "Salvar"
                ) : (
                  "Criar Tarefa"
                )}
              </Button>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}

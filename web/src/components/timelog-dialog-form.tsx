"use client";
import {
  ControlledDatePicker,
  ControlledInput,
  ControlledSelect,
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
import { TimeLog, useTimeLogs } from "@/hooks/use-timelogs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useTasks } from "@/hooks/use-tasks";

const TimeLogSchema = z.object({
  taskId: z.string().uuid({ message: "Selecione uma tarefa" }),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional(),
  duration: z.coerce.number().int().positive().optional(),
  status: z.enum(["running", "paused", "stopped"]),
});
type TimeLogForm = z.infer<typeof TimeLogSchema>;

export function TimeLogDialogForm({
  timelog,
  onClose,
}: {
  timelog?: TimeLog;
  onClose?: () => void;
}) {
  const isEdit = !!timelog;
  const [open, setOpen] = useState(false);
  const { createTimeLog, updateTimeLog } = useTimeLogs();
  const { user } = useCurrentUser();
  const { tasks } = useTasks();
  const methods = useForm<TimeLogForm>({
    resolver: zodResolver(TimeLogSchema),
    defaultValues: timelog
      ? {
          ...timelog,
          startTime: timelog.startTime
            ? new Date(timelog.startTime)
            : undefined,
          endTime: timelog.endTime ? new Date(timelog.endTime) : undefined,
        }
      : {
          status: "running",
        },
  });

  useEffect(() => {
    if (isEdit && timelog) {
      setOpen(true);
      methods.reset({
        ...timelog,
        startTime: timelog.startTime ? new Date(timelog.startTime) : undefined,
        endTime: timelog.endTime ? new Date(timelog.endTime) : undefined,
      });
    }
  }, [timelog]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  async function onSubmit(data: TimeLogForm) {
    if (!user?.id) return;
    const payload = {
      ...data,
      userId: user.id,
    };
    if (isEdit && timelog) {
      await updateTimeLog({ id: timelog.id, data: payload });
    } else {
      await createTimeLog(payload);
    }
    methods.reset();
    setOpen(false);
    onClose?.();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {!isEdit && (
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
            <PlusIcon />
            Adicionar
          </Button>
        )}
      </DialogTrigger>{" "}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Registro" : "Novo Registro de Tempo"}
          </DialogTitle>
        </DialogHeader>
        {methods.formState.isSubmitting ? (
          <div className="py-8 text-center text-muted-foreground">
            Salvando registro...
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <ControlledSelect
                name="taskId"
                label="Tarefa"
                required
                options={tasks.map((t) => ({ value: t.id, label: t.title }))}
                className="w-full"
              />
              <ControlledDatePicker name="startTime" label="Início" required />
              <ControlledDatePicker name="endTime" label="Fim" />
              <ControlledInput
                name="duration"
                label="Duração (min)"
                type="number"
              />
              <ControlledSelect
                name="status"
                label="Status"
                required
                options={[
                  { value: "running", label: "Em andamento" },
                  { value: "paused", label: "Pausado" },
                  { value: "stopped", label: "Finalizado" },
                ]}
              />
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

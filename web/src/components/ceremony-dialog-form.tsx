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
import { useCeremonies, Ceremony } from "@/hooks/use-ceremonies";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const CeremonySchema = z.object({
  type: z.enum(["DAILY", "PLANNING", "REVIEW", "RETROSPECTIVE"]),
  scheduledAt: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  duration: z.coerce.number().int().positive().optional(),
  participants: z.array(z.string()).optional(),
  timeLogs: z.array(z.string()).optional(),
});
type CeremonyForm = z.infer<typeof CeremonySchema>;

export function CeremonyDialogForm({
  ceremony,
  onClose,
}: {
  ceremony?: Ceremony;
  onClose?: () => void;
}) {
  const isEdit = !!ceremony;
  const [open, setOpen] = useState(false);
  const { createCeremony, updateCeremony } = useCeremonies();
  const methods = useForm<CeremonyForm>({
    resolver: zodResolver(CeremonySchema),
    defaultValues: ceremony
      ? {
          ...ceremony,
          scheduledAt: ceremony.scheduledAt
            ? new Date(ceremony.scheduledAt)
            : undefined,
          startTime: ceremony.startTime
            ? new Date(ceremony.startTime)
            : undefined,
          endTime: ceremony.endTime ? new Date(ceremony.endTime) : undefined,
        }
      : {
          type: "DAILY",
        },
  });

  useEffect(() => {
    if (isEdit && ceremony) {
      setOpen(true);
      methods.reset({
        ...ceremony,
        scheduledAt: ceremony.scheduledAt
          ? new Date(ceremony.scheduledAt)
          : undefined,
        startTime: ceremony.startTime
          ? new Date(ceremony.startTime)
          : undefined,
        endTime: ceremony.endTime ? new Date(ceremony.endTime) : undefined,
      });
    }
  }, [ceremony]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  async function onSubmit(data: CeremonyForm) {
    if (isEdit && ceremony) {
      await updateCeremony({ id: ceremony.id, data });
    } else {
      await createCeremony({ ...data, participants: [], timeLogs: [] });
    }
    methods.reset();
    setOpen(false);
    onClose?.();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {!isEdit && <Button>Nova Cerimônia</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Cerimônia" : "Nova Cerimônia"}
          </DialogTitle>
        </DialogHeader>
        {methods.formState.isSubmitting ? (
          <div className="py-8 text-center text-muted-foreground">
            Salvando cerimônia...
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <ControlledSelect
                name="type"
                label="Tipo"
                required
                options={[
                  { value: "DAILY", label: "Daily" },
                  { value: "PLANNING", label: "Planning" },
                  { value: "REVIEW", label: "Review" },
                  { value: "RETROSPECTIVE", label: "Retrospective" },
                ]}
              />
              <ControlledDatePicker
                name="scheduledAt"
                label="Agendada para"
                required
              />
              <ControlledDatePicker name="startTime" label="Início" required />
              <ControlledDatePicker name="endTime" label="Fim" required />
              <ControlledInput
                name="duration"
                label="Duração (min)"
                type="number"
              />
              {/* Participantes e timeLogs podem ser implementados como autocomplete/multiselect futuramente */}
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

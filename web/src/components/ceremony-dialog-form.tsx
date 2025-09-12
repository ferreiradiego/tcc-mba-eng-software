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
import { Ceremony, useCeremonies } from "@/hooks/use-ceremonies";
import { useSprints, Sprint } from "@/hooks/use-sprints";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

function toBrazilianTime(date: Date | string | null | undefined): string {
  if (!date) return "";
  let d: Date;
  if (typeof date === "string") {
    d = new Date(date);
  } else if (Object.prototype.toString.call(date) === "[object Date]") {
    d = date as Date;
  } else {
    return "";
  }
  if (isNaN(d.getTime()) || d.getTime() === 0) return "";
  d = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return d.toTimeString().slice(0, 5);
}

const CeremonySchema = z
  .object({
    type: z.enum(["DAILY", "PLANNING", "REVIEW", "RETROSPECTIVE", "OTHER"]),
    typeDesc: z.string().optional(),
    scheduledAt: z.coerce.date(),
    startTime: z.string(),
    endTime: z.string(),
    participants: z.array(z.string()).optional(),
    sprintId: z.string().uuid().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "OTHER" &&
      (!data.typeDesc || data.typeDesc.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Descrição obrigatória para tipo OUTRO",
        path: ["typeDesc"],
      });
    }
  });
type CeremonyForm = z.infer<typeof CeremonySchema>;

function getCeremonyDefaultValues(ceremony?: Ceremony): Partial<CeremonyForm> {
  if (!ceremony) {
    return {
      type: "DAILY",
      typeDesc: "",
      scheduledAt: undefined,
      participants: [],
      startTime: "",
      endTime: "",
    };
  }
  const parseTime = (val: unknown) => {
    if (!val || val === "1970-01-01T00:00:00.000Z") return "";
    if (val instanceof Date) {
      if (isNaN(val.getTime()) || val.getTime() === 0) return "";
      return toBrazilianTime(val);
    }
    if (typeof val === "string") {
      if (/^\d{2}:\d{2}$/.test(val.slice(11, 16))) return val.slice(11, 16);
      if (/^\d{2}:\d{2}$/.test(val)) return val;
      return toBrazilianTime(val);
    }
    return "";
  };
  return {
    type: ceremony.type as CeremonyForm["type"],
    typeDesc: ceremony.typeDesc || "",
    scheduledAt: ceremony.scheduledAt
      ? new Date(ceremony.scheduledAt)
      : undefined,
    startTime: parseTime(ceremony.startTime),
    endTime: parseTime(ceremony.endTime),
    participants: ceremony.participants || [],
    sprintId: ceremony.sprintId || undefined,
  };
}

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
  const { sprints, loading: loadingSprints } = useSprints();

  const methods = useForm<CeremonyForm>({
    resolver: zodResolver(CeremonySchema),
    defaultValues: getCeremonyDefaultValues(ceremony),
  });

  useEffect(() => {
    if (isEdit && ceremony) {
      setOpen(true);
      methods.reset(getCeremonyDefaultValues(ceremony));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ceremony]);

  const selectedType = methods.watch("type");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  async function onSubmit(data: CeremonyForm) {
    const scheduledDate =
      data.scheduledAt instanceof Date
        ? data.scheduledAt
        : new Date(data.scheduledAt);
    function combineTimeUTC(date: Date, time: string) {
      const [h, m] = time.split(":");
      const d = new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          Number(h),
          Number(m),
          0,
          0
        )
      );
      return d;
    }
    const startTime = combineTimeUTC(scheduledDate, data.startTime);
    const endTime = combineTimeUTC(scheduledDate, data.endTime);
    const payload = {
      ...data,
      startTime,
      endTime,
      sprintId: data.sprintId || undefined,
      participants: data.participants ?? [],
    };
    if (isEdit && ceremony) {
      await updateCeremony({ id: ceremony.id, data: payload });
    } else {
      await createCeremony({ ...payload, participants: [] });
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
                  { value: "OTHER", label: "Outro" },
                ]}
              />
              {selectedType === "OTHER" && (
                <ControlledInput
                  name="typeDesc"
                  label="Descrição do tipo"
                  required
                />
              )}
              <ControlledDatePicker
                name="scheduledAt"
                label="Agendada para"
                required
              />
              <ControlledInput
                name="startTime"
                label="Início"
                type="time"
                required
              />
              <ControlledInput
                name="endTime"
                label="Fim"
                type="time"
                required
              />
              <ControlledSelect
                name="sprintId"
                label="Sprint"
                options={
                  loadingSprints
                    ? []
                    : sprints.map((s: Sprint) => ({
                        value: s.id,
                        label: `${s.name} (${new Date(
                          s.startDate
                        ).toLocaleDateString()} - ${new Date(
                          s.endDate
                        ).toLocaleDateString()})`,
                      }))
                }
                required={false}
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

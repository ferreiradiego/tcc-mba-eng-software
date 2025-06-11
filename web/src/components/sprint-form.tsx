import { ControlledInput } from "@/components/controlled-fields";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const SprintSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  startDate: z.string().min(8, "Data obrigatória"),
  endDate: z.string().min(8, "Data obrigatória"),
});
type SprintFormType = z.infer<typeof SprintSchema>;

type Props = {
  onSubmit: (data: SprintFormType) => void;
  loading: boolean;
  initialValues?: Partial<SprintFormType>;
};

export function SprintForm({ onSubmit, loading, initialValues }: Props) {
  const methods = useForm<SprintFormType>({
    resolver: zodResolver(SprintSchema),
    defaultValues: initialValues || { name: "", startDate: "", endDate: "" },
  });
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialValues?.startDate ? new Date(initialValues.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialValues?.endDate ? new Date(initialValues.endDate) : undefined
  );

  useEffect(() => {
    if (initialValues?.startDate)
      setStartDate(new Date(initialValues.startDate));
    if (initialValues?.endDate) setEndDate(new Date(initialValues.endDate));
    if (initialValues) {
      methods.reset(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  function handleStartDate(date: Date | undefined) {
    setStartDate(date);
    methods.setValue("startDate", date ? date.toISOString() : "");
  }
  function handleEndDate(date: Date | undefined) {
    setEndDate(date);
    methods.setValue("endDate", date ? date.toISOString() : "");
  }

  return (
    <FormProvider {...methods}>
      <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
        <ControlledInput name="name" label="Nome da Sprint" required />
        <div>
          <label className="block text-sm font-medium mb-1">
            Data de início
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={
                  "w-full justify-start text-left font-normal" +
                  (startDate ? "" : " text-muted-foreground")
                }
                type="button"
              >
                {startDate
                  ? format(startDate, "P", { locale: ptBR })
                  : "Escolha a data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Data de término
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={
                  "w-full justify-start text-left font-normal" +
                  (endDate ? "" : " text-muted-foreground")
                }
                type="button"
              >
                {endDate
                  ? format(endDate, "P", { locale: ptBR })
                  : "Escolha a data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading
            ? "Salvando..."
            : initialValues
            ? "Salvar Alterações"
            : "Cadastrar Sprint"}
        </Button>
      </form>
    </FormProvider>
  );
}

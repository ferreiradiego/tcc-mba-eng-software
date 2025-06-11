import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";
import { useState } from "react";
import { ControlledInput } from "@/components/controlled-fields";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { Calendar } from "@/components/ui/calendar";

const SprintSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  startDate: z.string().min(8, "Data obrigatória"),
  endDate: z.string().min(8, "Data obrigatória"),
});
type SprintFormType = z.infer<typeof SprintSchema>;

export function SprintForm({ onSubmit, loading }: { onSubmit: (data: SprintFormType) => void; loading: boolean }) {
  const methods = useForm<SprintFormType>({
    resolver: zodResolver(SprintSchema),
    defaultValues: { name: "", startDate: "", endDate: "" },
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

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
          <label className="block text-sm font-medium mb-1">Data de início</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={"w-full justify-start text-left font-normal" + (startDate ? "" : " text-muted-foreground")}
                type="button"
              >
                {startDate ? format(startDate, "dd/MM/yyyy") : "Escolha a data"}
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
          <label className="block text-sm font-medium mb-1">Data de término</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={"w-full justify-start text-left font-normal" + (endDate ? "" : " text-muted-foreground")}
                type="button"
              >
                {endDate ? format(endDate, "dd/MM/yyyy") : "Escolha a data"}
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
          {loading ? "Salvando..." : "Cadastrar Sprint"}
        </Button>
      </form>
    </FormProvider>
  );
}

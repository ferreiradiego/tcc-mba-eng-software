import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { ControlledInput } from "./controlled-fields";
import { Button } from "./ui";

const TrimesterSchema = z.object({
  year: z.number().min(2020, "Ano inválido"),
  number: z.number().min(1).max(4, "Trimestre deve ser entre 1 e 4"),
});
type TrimesterFormType = z.infer<typeof TrimesterSchema>;

export function TrimesterForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: TrimesterFormType) => void;
  loading: boolean;
}) {
  const methods = useForm<TrimesterFormType>({
    resolver: zodResolver(TrimesterSchema),
    defaultValues: { year: new Date().getFullYear(), number: 1 },
  });

  return (
    <FormProvider {...methods}>
      <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
        <ControlledInput name="year" label="Ano" type="number" required />
        <ControlledInput
          name="number"
          label="Trimestre (1-4)"
          type="number"
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : "Cadastrar Trimestre"}
        </Button>
      </form>
    </FormProvider>
  );
}

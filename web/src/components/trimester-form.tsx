import { ControlledInput } from "@/components/controlled-fields";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const TrimesterSchema = z.object({
  year: z.number().min(2020, "Ano inválido"),
  number: z.coerce.number().min(1).max(4, "Trimestre deve ser entre 1 e 4"),
});
type TrimesterFormType = z.infer<typeof TrimesterSchema>;

type Props = {
  onSubmit: (data: TrimesterFormType) => void;
  loading: boolean;
  initialValues?: Partial<TrimesterFormType>;
};

export function TrimesterForm({ onSubmit, loading, initialValues }: Props) {
  const methods = useForm<TrimesterFormType>({
    resolver: zodResolver(TrimesterSchema),
    defaultValues: initialValues || { year: new Date().getFullYear(), number: 1 },
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
          {loading ? "Salvando..." : initialValues ? "Salvar Alterações" : "Cadastrar Trimestre"}
        </Button>
      </form>
    </FormProvider>
  );
}

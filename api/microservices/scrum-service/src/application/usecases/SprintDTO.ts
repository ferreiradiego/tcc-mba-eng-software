import { z } from "zod";

export const SprintSchema = z.object({
  name: z.string().min(2),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  trimesterId: z.string().uuid(),
});

export type SprintDTO = z.infer<typeof SprintSchema>;

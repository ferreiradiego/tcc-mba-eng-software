import { z } from "zod";

export const TrimesterSchema = z.object({
  year: z.number().int().min(2000),
  number: z.number().int().min(1).max(4),
});

export type TrimesterDTO = z.infer<typeof TrimesterSchema>;

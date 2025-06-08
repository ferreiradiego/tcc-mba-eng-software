import { CeremonyType } from '../../domain/entities/Ceremony';
import { z } from 'zod';

export const CeremonySchema = z.object({
  type: z.nativeEnum(CeremonyType),
  scheduledAt: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  duration: z.number().int().optional(),
  participants: z.array(z.string()),
  timeLogs: z.array(z.string()),
});

export type CeremonyDTO = z.infer<typeof CeremonySchema>;

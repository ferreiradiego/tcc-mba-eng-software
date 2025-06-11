import { CeremonyType } from '../../domain/entities/Ceremony';
import { z } from 'zod';

export const CeremonySchema = z.object({
  type: z.nativeEnum(CeremonyType),
  typeDesc: z.string().optional(),
  scheduledAt: z.coerce.date(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  participants: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  if (data.type === CeremonyType.OTHER && (!data.typeDesc || data.typeDesc.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Descrição obrigatória para tipo OUTRO',
      path: ['typeDesc'],
    });
  }
});

export const CeremonyUpdateSchema = z.object({
  type: z.nativeEnum(CeremonyType).optional(),
  typeDesc: z.string().optional(),
  scheduledAt: z.coerce.date().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  participants: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  if (data.type === CeremonyType.OTHER && (!data.typeDesc || data.typeDesc.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Descrição obrigatória para tipo OUTRO',
      path: ['typeDesc'],
    });
  }
});

export type CeremonyDTO = z.infer<typeof CeremonySchema>;

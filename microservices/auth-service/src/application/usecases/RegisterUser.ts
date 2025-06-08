import { User } from '@domain/entities/User';
import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.string().optional(),
});

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;

export interface RegisterUser {
  execute(data: RegisterUserDTO): Promise<User>;
}

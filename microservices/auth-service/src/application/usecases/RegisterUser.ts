// src/application/usecases/RegisterUser.ts
import { User } from '../../domain/entities/User';

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface RegisterUser {
  execute(data: RegisterUserDTO): Promise<User>;
}

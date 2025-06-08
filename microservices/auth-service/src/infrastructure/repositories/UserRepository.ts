// src/infrastructure/repositories/UserRepository.ts
import { User } from '../../domain/entities/User';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  findById(id: string): Promise<User | null>;
}

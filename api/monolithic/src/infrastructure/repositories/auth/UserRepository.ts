import type { User } from "@domain/entities/auth/User";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, "id">): Promise<User>;
  findById(id: string): Promise<User | null>;
}

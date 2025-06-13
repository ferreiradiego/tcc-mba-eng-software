import type { User } from "@domain/entities/auth/User";
import { prisma } from "@infrastructure/prisma/client";
import type { UserRepository } from "./UserRepository";

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user as User | null;
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const created = await prisma.user.create({ data: user });
    return created as User;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user as User | null;
  }
}

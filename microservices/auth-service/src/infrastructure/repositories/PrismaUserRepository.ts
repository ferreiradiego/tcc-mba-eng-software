// src/infrastructure/repositories/PrismaUserRepository.ts
import { UserRepository } from './UserRepository';
import { User } from '../../domain/entities/User';
import { prisma } from '../prisma/client';

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user as User | null;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const created = await prisma.user.create({ data: user });
    return created as User;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user as User | null;
  }
}

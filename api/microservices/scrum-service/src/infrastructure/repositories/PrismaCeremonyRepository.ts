import { Ceremony } from "@domain/entities/Ceremony";
import { prisma } from "@infrastructure/prisma/client";
import { CeremonyRepository } from "./CeremonyRepository";

export class PrismaCeremonyRepository implements CeremonyRepository {
  async findAll(): Promise<Ceremony[]> {
    return prisma.ceremony.findMany() as any;
  }

  async findById(id: string): Promise<Ceremony | null> {
    return (await prisma.ceremony.findUnique({ where: { id } })) as any;
  }

  async create(
    ceremony: Omit<Ceremony, "id" | "createdAt" | "updatedAt">
  ): Promise<Ceremony> {
    return (await prisma.ceremony.create({ data: ceremony })) as any;
  }

  async update(
    id: string,
    ceremony: Partial<Omit<Ceremony, "id" | "createdAt" | "updatedAt">>
  ): Promise<Ceremony | null> {
    return (await prisma.ceremony.update({
      where: { id },
      data: ceremony,
    })) as any;
  }

  async delete(id: string): Promise<void> {
    await prisma.ceremony.delete({ where: { id } });
  }
}

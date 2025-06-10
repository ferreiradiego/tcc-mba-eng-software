import { Ceremony } from "@domain/entities/Ceremony";
import { prisma } from "@infrastructure/prisma/client";
import { CeremonyRepository } from "./CeremonyRepository";

export class PrismaCeremonyRepository implements CeremonyRepository {
  async findAll(): Promise<Ceremony[]> {
    const ceremonies = await prisma.ceremony.findMany();
    return ceremonies.map(mapPrismaCeremonyToDomain);
  }

  async findById(id: string): Promise<Ceremony | null> {
    const ceremony = await prisma.ceremony.findUnique({ where: { id } });
    return ceremony ? mapPrismaCeremonyToDomain(ceremony) : null;
  }

  async create(
    ceremony: Omit<Ceremony, "id" | "createdAt" | "updatedAt">
  ): Promise<Ceremony> {
    const { timeLogs, ...rest } = ceremony;
    const created = await prisma.ceremony.create({
      data: {
        ...rest,
        timeLogs:
          timeLogs && Array.isArray(timeLogs)
            ? { connect: timeLogs.map((id) => ({ id })) }
            : undefined,
      },
    });
    return mapPrismaCeremonyToDomain(created);
  }

  async update(
    id: string,
    ceremony: Partial<Omit<Ceremony, "id" | "createdAt" | "updatedAt">>
  ): Promise<Ceremony | null> {
    const { timeLogs, ...rest } = ceremony;
    const updated = await prisma.ceremony.update({
      where: { id },
      data: {
        ...rest,
        ...(timeLogs && Array.isArray(timeLogs)
          ? { timeLogs: { set: [], connect: timeLogs.map((id) => ({ id })) } }
          : {}),
      },
    });
    return mapPrismaCeremonyToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.ceremony.delete({ where: { id } });
  }
}

function mapPrismaCeremonyToDomain(prismaCeremony: any): Ceremony {
  return {
    id: prismaCeremony.id,
    type: prismaCeremony.type,
    scheduledAt: prismaCeremony.scheduledAt,
    startTime: prismaCeremony.startTime,
    endTime: prismaCeremony.endTime,
    duration: prismaCeremony.duration ?? undefined,
    participants: prismaCeremony.participants ?? [],
    timeLogs: prismaCeremony.timeLogs
      ? prismaCeremony.timeLogs.map((tl: any) => tl.id)
      : [],
    createdAt: prismaCeremony.createdAt,
    updatedAt: prismaCeremony.updatedAt,
  };
}

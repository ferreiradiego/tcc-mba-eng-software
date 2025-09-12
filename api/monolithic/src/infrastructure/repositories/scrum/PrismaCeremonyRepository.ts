import { prisma } from "@infrastructure/prisma/client";
import { CeremonyRepository } from "./CeremonyRepository";
import { $Enums } from "@prisma/client";
import type { Ceremony } from "@domain/entities/scrum/Ceremony";

export class PrismaCeremonyRepository implements CeremonyRepository {
  async findAll(
    userId?: string,
    year?: number,
    number?: number
  ): Promise<Ceremony[]> {
    let where: any = {};
    if (year && number) {
      const sprints = await prisma.sprint.findMany({
        where: {
          trimester: { year, number },
        },
        select: { id: true },
      });
      const sprintIds = sprints.map((s) => s.id);
      where.sprintId = { in: sprintIds };
    }
    const ceremonies = await prisma.ceremony.findMany({
      where,
      include: { sprint: true },
    });
    return ceremonies.map(mapPrismaCeremonyToDomain);
  }

  async findById(id: string): Promise<Ceremony | null> {
    const ceremony = await prisma.ceremony.findUnique({
      where: { id },
      include: { sprint: true },
    });
    return ceremony ? mapPrismaCeremonyToDomain(ceremony) : null;
  }

  async create(
    ceremony: Omit<Ceremony, "id" | "createdAt" | "updatedAt">
  ): Promise<Ceremony> {
    const { sprint, ...rest } = ceremony;
    const duration =
      rest.startTime && rest.endTime
        ? Math.round(
            (rest.endTime.getTime() - rest.startTime.getTime()) / 60000
          )
        : undefined;
    const created = await prisma.ceremony.create({
      data: {
        ...rest,
        type: rest.type as $Enums.CeremonyType,
        duration,
        sprintId: rest.sprintId,
      },
      include: { sprint: true },
    });
    return mapPrismaCeremonyToDomain(created);
  }

  async update(
    id: string,
    ceremony: Partial<Omit<Ceremony, "id" | "createdAt" | "updatedAt">>
  ): Promise<Ceremony | null> {
    const { sprint, ...rest } = ceremony;
    const duration =
      rest.startTime && rest.endTime
        ? Math.round(
            (rest.endTime.getTime() - rest.startTime.getTime()) / 60000
          )
        : undefined;
    const updated = await prisma.ceremony.update({
      where: { id },
      data: {
        ...rest,
        type: rest.type as $Enums.CeremonyType,
        duration,
        sprintId: rest.sprintId,
      },
      include: { sprint: true },
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
    typeDesc: prismaCeremony.typeDesc,
    scheduledAt: prismaCeremony.scheduledAt,
    startTime: prismaCeremony.startTime,
    endTime: prismaCeremony.endTime,
    duration: prismaCeremony.duration ?? undefined,
    participants: prismaCeremony.participants ?? [],
    createdAt: prismaCeremony.createdAt,
    updatedAt: prismaCeremony.updatedAt,
    sprintId: prismaCeremony.sprintId,
    sprint: prismaCeremony.sprint ?? undefined,
  };
}

import { Ceremony } from "@domain/entities/Ceremony";
import { prisma } from "@infrastructure/prisma/client";
import { CeremonyRepository } from "./CeremonyRepository";
import { $Enums } from "@prisma/client";

export class PrismaCeremonyRepository implements CeremonyRepository {
  async findAll(): Promise<Ceremony[]> {
    const ceremonies = await prisma.ceremony.findMany();

    console.log(ceremonies)
    return ceremonies.map(mapPrismaCeremonyToDomain);
  }

  async findById(id: string): Promise<Ceremony | null> {
    const ceremony = await prisma.ceremony.findUnique({ where: { id } });
    return ceremony ? mapPrismaCeremonyToDomain(ceremony) : null;
  }

  async create(
    ceremony: Omit<Ceremony, "id" | "createdAt" | "updatedAt">
  ): Promise<Ceremony> {

    console.log(ceremony)

    const { timeLogs, ...rest } = ceremony;
    const duration =
      rest.startTime && rest.endTime
        ? Math.round((rest.endTime.getTime() - rest.startTime.getTime()) / 60000)
        : undefined;
    const created = await prisma.ceremony.create({
      data: {
        ...rest,
        type: rest.type as $Enums.CeremonyType,
        duration,
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
    const duration =
      rest.startTime && rest.endTime
        ? Math.round((rest.endTime.getTime() - rest.startTime.getTime()) / 60000)
        : undefined;
    const updated = await prisma.ceremony.update({
      where: { id },
      data: {
        ...rest,
        type: rest.type as $Enums.CeremonyType,
        duration,
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
    typeDesc: prismaCeremony.typeDesc,
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

import { Trimester } from "@domain/entities/scrum/Trimester";
import { PrismaClient } from "@prisma/client";
import type { TrimesterRepository } from "./TrimesterRepository";
import { Sprint } from "@domain/entities/scrum/Sprint";
import { UserStory } from "@domain/entities/scrum/UserStory";
import { Ceremony, CeremonyType } from "@domain/entities/scrum/Ceremony";

export class PrismaTrimesterRepository implements TrimesterRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Trimester | null> {
    const data = await this.prisma.trimester.findUnique({
      where: { id },
      include: {
        sprints: {
          include: {
            userStories: { include: { tasks: true } },
            ceremonies: true,
          },
        },
      },
    });
    if (!data) return null;
    const sprints = (data.sprints || []).map((s) => {
      const sprint = new Sprint(
        s.id,
        s.name,
        s.startDate,
        s.endDate,
        s.trimesterId,
        undefined,
        (s.userStories || []).map(
          (us) =>
            new UserStory(
              us.id,
              us.title,
              us.status,
              us.description ?? undefined,
              us.activationDate ?? undefined,
              us.blocked,
              us.createdAt,
              us.updatedAt,
              (us.tasks || []).map((t: any) => ({
                ...t,
                description: t.description ?? undefined,
                userStoryId: t.userStoryId ?? undefined,
              })),
              us.sprintId ?? undefined
            )
        )
      );
      (sprint as any).ceremonies = (s.ceremonies || []).map(
        (c) =>
          new Ceremony(
            {
              type: CeremonyType[c.type as keyof typeof CeremonyType],
              typeDesc: c.typeDesc ?? undefined,
              scheduledAt: c.scheduledAt,
              startTime: c.startTime,
              endTime: c.endTime,
              duration: c.duration ?? undefined,
              participants: c.participants,
              sprintId: c.sprintId ?? undefined,
              sprint: undefined,
            },
            c.id
          )
      );
      return sprint;
    });
    return new Trimester(data.id, data.year, data.number, sprints);
  }

  async findAll(): Promise<Trimester[]> {
    const data = await this.prisma.trimester.findMany({
      include: {
        sprints: {
          include: {
            userStories: { include: { tasks: true } },
            ceremonies: true,
          },
        },
      },
    });
    return data.map((t) => {
      const sprints = (t.sprints || []).map((s) => {
        const sprint = new Sprint(
          s.id,
          s.name,
          s.startDate,
          s.endDate,
          s.trimesterId,
          undefined,
          (s.userStories || []).map(
            (us) =>
              new UserStory(
                us.id,
                us.title,
                us.status,
                us.description ?? undefined,
                us.activationDate ?? undefined,
                us.blocked,
                us.createdAt,
                us.updatedAt,
                (us.tasks || []).map((t: any) => ({
                  ...t,
                  description: t.description ?? undefined,
                  userStoryId: t.userStoryId ?? undefined,
                })),
                us.sprintId ?? undefined
              )
          )
        );
        (sprint as any).ceremonies = (s.ceremonies || []).map(
          (c) =>
            new Ceremony(
              {
                type: CeremonyType[c.type as keyof typeof CeremonyType],
                typeDesc: c.typeDesc ?? undefined,
                scheduledAt: c.scheduledAt,
                startTime: c.startTime,
                endTime: c.endTime,
                duration: c.duration ?? undefined,
                participants: c.participants,
                sprintId: c.sprintId ?? undefined,
                sprint: undefined,
              },
              c.id
            )
        );
        return sprint;
      });
      return new Trimester(t.id, t.year, t.number, sprints);
    });
  }

  async create(trimester: Trimester): Promise<Trimester> {
    const { year, number } = trimester;
    const data = await this.prisma.trimester.create({
      data: {
        year,
        number,
      },
    });
    return new Trimester(data.id, data.year, data.number);
  }

  async update(trimester: Trimester): Promise<Trimester> {
    const { year, number } = trimester;
    const data = await this.prisma.trimester.update({
      where: { id: trimester.id },
      data: {
        year,
        number,
      },
    });
    return new Trimester(data.id, data.year, data.number);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.trimester.delete({ where: { id } });
  }
}

import { PrismaClient } from "@prisma/client";
import { Sprint } from "../../domain/entities/Sprint";
import { SprintRepository } from "./SprintRepository";

export class PrismaSprintRepository implements SprintRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Sprint | null> {
    const data = await this.prisma.sprint.findUnique({ where: { id } });
    if (!data) return null;
    return new Sprint(
      data.id,
      data.name,
      data.startDate,
      data.endDate,
      data.trimesterId
    );
  }

  async findAll(): Promise<Sprint[]> {
    const data = await this.prisma.sprint.findMany();
    return data.map(
      (s) => new Sprint(s.id, s.name, s.startDate, s.endDate, s.trimesterId)
    );
  }

  async create(sprint: Sprint): Promise<Sprint> {
    const data = await this.prisma.sprint.create({
      data: {
        name: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        trimesterId: sprint.trimesterId,
      },
    });
    return new Sprint(
      data.id,
      data.name,
      data.startDate,
      data.endDate,
      data.trimesterId
    );
  }

  async update(sprint: Sprint): Promise<Sprint> {
    const data = await this.prisma.sprint.update({
      where: { id: sprint.id },
      data: {
        name: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        trimesterId: sprint.trimesterId,
      },
    });
    return new Sprint(
      data.id,
      data.name,
      data.startDate,
      data.endDate,
      data.trimesterId
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.sprint.delete({ where: { id } });
  }
}

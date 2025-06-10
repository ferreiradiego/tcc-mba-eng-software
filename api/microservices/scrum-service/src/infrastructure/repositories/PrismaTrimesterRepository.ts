import { PrismaClient } from "@prisma/client";
import { Trimester } from "../../domain/entities/Trimester";
import { TrimesterRepository } from "./TrimesterRepository";

export class PrismaTrimesterRepository implements TrimesterRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Trimester | null> {
    const data = await this.prisma.trimester.findUnique({ where: { id } });
    if (!data) return null;
    return new Trimester(data.id, data.year, data.number);
  }

  async findAll(): Promise<Trimester[]> {
    const data = await this.prisma.trimester.findMany();
    return data.map((t) => new Trimester(t.id, t.year, t.number));
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

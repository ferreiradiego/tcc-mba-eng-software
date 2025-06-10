import { Prisma, PrismaClient } from "@prisma/client";
import { UserStory } from "../../domain/entities/UserStory";
import { UserStoryRepository } from "../../domain/repositories/UserStoryRepository";
import { toUserStory } from "./mappers/toUserStory";

const prisma = new PrismaClient();

function toPrismaCreateInput(
  data: Partial<UserStory>
): Prisma.UserStoryCreateInput {
  return {
    title: data.title!,
    status: data.status!,
    description: data.description,
    activationDate: data.activationDate,
    sprintCode: data.sprintCode,
    blocked: data.blocked ?? false,
    // tasks: undefined // handled by relation if needed
  };
}

function toPrismaUpdateInput(
  data: Partial<UserStory>
): Prisma.UserStoryUpdateInput {
  const { id, createdAt, updatedAt, tasks, ...rest } = data;
  return {
    ...rest,
  };
}

export class PrismaUserStoryRepository implements UserStoryRepository {
  async create(data: Partial<UserStory>): Promise<UserStory> {
    const created = await prisma.userStory.create({
      data: toPrismaCreateInput(data),
    });
    return toUserStory(created);
  }
  async findById(id: string): Promise<UserStory | null> {
    const found = await prisma.userStory.findUnique({ where: { id } });
    return found ? toUserStory(found) : null;
  }
  async findAll(): Promise<UserStory[]> {
    const all = await prisma.userStory.findMany();
    return all.map(toUserStory);
  }
  async update(
    id: string,
    data: Partial<UserStory>
  ): Promise<UserStory | null> {
    const updated = await prisma.userStory.update({
      where: { id },
      data: toPrismaUpdateInput(data),
    });
    return updated ? toUserStory(updated) : null;
  }
  async delete(id: string): Promise<void> {
    await prisma.userStory.delete({ where: { id } });
  }
}

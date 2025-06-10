import { UserStory as PrismaUserStory } from '@prisma/client';
import { UserStory } from '../../../domain/entities/UserStory';

export function toUserStory(prismaUserStory: PrismaUserStory): UserStory {
  return new UserStory(
    prismaUserStory.id,
    prismaUserStory.title,
    prismaUserStory.status,
    prismaUserStory.description ?? undefined,
    prismaUserStory.activationDate ?? undefined,
    prismaUserStory.sprintCode ?? undefined,
    prismaUserStory.blocked,
    prismaUserStory.createdAt,
    prismaUserStory.updatedAt
  );
}

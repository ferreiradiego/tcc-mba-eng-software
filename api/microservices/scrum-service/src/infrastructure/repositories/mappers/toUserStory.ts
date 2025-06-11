import { UserStory } from "../../../domain/entities/UserStory";

export function toUserStory(prismaUserStory: any): UserStory {
  const sprint =
    prismaUserStory.sprint && typeof prismaUserStory.sprint === "object"
      ? {
          id: prismaUserStory.sprint.id,
          name: prismaUserStory.sprint.name,
          startDate: prismaUserStory.sprint.startDate,
          endDate: prismaUserStory.sprint.endDate,
          trimesterId: prismaUserStory.sprint.trimesterId,
        }
      : undefined;
  return new UserStory(
    prismaUserStory.id,
    prismaUserStory.title,
    prismaUserStory.status,
    prismaUserStory.description ?? undefined,
    prismaUserStory.activationDate ?? undefined,
    prismaUserStory.blocked,
    prismaUserStory.createdAt,
    prismaUserStory.updatedAt,
    undefined,
    prismaUserStory.sprintId ?? undefined,
    sprint
  );
}

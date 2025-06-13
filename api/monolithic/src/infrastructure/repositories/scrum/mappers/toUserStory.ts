import { Sprint } from "@domain/entities/scrum/Sprint";
import { Trimester } from "@domain/entities/scrum/Trimester";
import { UserStory } from "@domain/entities/scrum/UserStory";


export function toUserStory(prismaUserStory: any): UserStory {
  let trimester;
  if (
    prismaUserStory.sprint &&
    prismaUserStory.sprint.trimester &&
    typeof prismaUserStory.sprint.trimester === "object"
  ) {
    trimester = new Trimester(
      prismaUserStory.sprint.trimester.id,
      prismaUserStory.sprint.trimester.year,
      prismaUserStory.sprint.trimester.number
    );
  }

  const sprint =
    prismaUserStory.sprint && typeof prismaUserStory.sprint === "object"
      ? new Sprint(
          prismaUserStory.sprint.id,
          prismaUserStory.sprint.name,
          prismaUserStory.sprint.startDate,
          prismaUserStory.sprint.endDate,
          prismaUserStory.sprint.trimesterId,
          trimester
        )
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

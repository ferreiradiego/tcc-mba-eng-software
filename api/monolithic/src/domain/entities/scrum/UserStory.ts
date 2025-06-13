import type { UserStoryStatus } from "@prisma/client";
import type { Sprint } from "./Sprint";
import type { Task } from "./Task";

export class UserStory {
  constructor(
    public id: string,
    public title: string,
    public status: UserStoryStatus,
    public description?: string,
    public activationDate?: Date,
    public blocked: boolean = false,
    public createdAt?: Date,
    public updatedAt?: Date,
    public tasks?: Task[],
    public sprintId?: string,
    public sprint?: Sprint
  ) {}
}

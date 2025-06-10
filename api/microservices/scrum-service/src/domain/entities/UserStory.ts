// UserStory domain entity
export class UserStory {
  constructor(
    public id: string,
    public title: string,
    public status: string,
    public description?: string,
    public activationDate?: Date,
    public sprintCode?: string,
    public blocked: boolean = false,
    public createdAt?: Date,
    public updatedAt?: Date,
    public tasks?: any[] // You may want to type this with Task[] if available
  ) {}
}

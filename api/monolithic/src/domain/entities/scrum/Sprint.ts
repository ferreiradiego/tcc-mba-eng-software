import type { Trimester } from "./Trimester";
import type { UserStory } from "./UserStory";

export class Sprint {
  constructor(
    public id: string,
    public name: string,
    public startDate: Date,
    public endDate: Date,
    public trimesterId: string,
    public trimester?: Trimester,
    public userStories?: UserStory[]
  ) {}
}

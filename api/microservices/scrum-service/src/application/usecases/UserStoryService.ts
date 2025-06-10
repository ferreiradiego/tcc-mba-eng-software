import type { UserStory } from "@domain/entities/UserStory";
import { PrismaUserStoryRepository } from "@infrastructure/repositories/PrismaUserStoryRepository";

export class UserStoryService {
  private userStoryRepo: PrismaUserStoryRepository;
  constructor() {
    this.userStoryRepo = new PrismaUserStoryRepository();
  }

  async listUserStories(): Promise<UserStory[]> {
    return this.userStoryRepo.findAll();
  }

  async getUserStory(id: string): Promise<UserStory | null> {
    return this.userStoryRepo.findById(id);
  }

  async createUserStory(
    data: Omit<UserStory, "id" | "createdAt" | "updatedAt">
  ): Promise<UserStory> {
    return this.userStoryRepo.create(data);
  }

  async updateUserStory(
    id: string,
    data: Partial<Omit<UserStory, "id" | "createdAt" | "updatedAt">>
  ): Promise<UserStory | null> {
    return this.userStoryRepo.update(id, data);
  }

  async deleteUserStory(id: string): Promise<void> {
    return this.userStoryRepo.delete(id);
  }
}

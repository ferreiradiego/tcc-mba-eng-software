import { UserStory } from '../entities/UserStory';

export interface UserStoryRepository {
  create(data: Partial<UserStory>): Promise<UserStory>;
  findById(id: string): Promise<UserStory | null>;
  findAll(): Promise<UserStory[]>;
  update(id: string, data: Partial<UserStory>): Promise<UserStory | null>;
  delete(id: string): Promise<void>;
}

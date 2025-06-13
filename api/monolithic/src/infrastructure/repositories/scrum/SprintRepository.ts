import type { Sprint } from "@domain/entities/scrum/Sprint";

export interface SprintRepository {
  findById(id: string): Promise<Sprint | null>;
  findAll(): Promise<Sprint[]>;
  create(sprint: Sprint): Promise<Sprint>;
  update(sprint: Sprint): Promise<Sprint>;
  delete(id: string): Promise<void>;
}

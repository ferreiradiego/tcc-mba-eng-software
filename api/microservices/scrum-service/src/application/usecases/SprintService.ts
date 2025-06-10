import { SprintRepository } from "../../infrastructure/repositories/SprintRepository";
import { Sprint } from "../../domain/entities/Sprint";
import { SprintDTO } from "./SprintDTO";

export class SprintService {
  constructor(private repo: SprintRepository) {}

  async create(data: SprintDTO): Promise<Sprint> {
    const sprint = new Sprint("", data.name, data.startDate, data.endDate, data.trimesterId);
    return this.repo.create(sprint);
  }

  async getAll(): Promise<Sprint[]> {
    return this.repo.findAll();
  }

  async getById(id: string): Promise<Sprint | null> {
    return this.repo.findById(id);
  }

  async update(id: string, data: SprintDTO): Promise<Sprint> {
    const sprint = new Sprint(id, data.name, data.startDate, data.endDate, data.trimesterId);
    return this.repo.update(sprint);
  }

  async delete(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}

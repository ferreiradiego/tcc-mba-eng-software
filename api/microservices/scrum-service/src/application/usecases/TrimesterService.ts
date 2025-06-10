import { TrimesterRepository } from "../../infrastructure/repositories/TrimesterRepository";
import { Trimester } from "../../domain/entities/Trimester";
import { TrimesterDTO } from "./TrimesterDTO";

export class TrimesterService {
  constructor(private repo: TrimesterRepository) {}

  async create(data: TrimesterDTO): Promise<Trimester> {
    const trimester = new Trimester("", data.year, data.number, []);
    return this.repo.create(trimester);
  }

  async getAll(): Promise<Trimester[]> {
    return this.repo.findAll();
  }

  async getById(id: string): Promise<Trimester | null> {
    return this.repo.findById(id);
  }

  async update(id: string, data: TrimesterDTO): Promise<Trimester> {
    const trimester = new Trimester(id, data.year, data.number, []);
    return this.repo.update(trimester);
  }

  async delete(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}

import type { Trimester } from "@domain/entities/scrum/Trimester";

export interface TrimesterRepository {
  findById(id: string): Promise<Trimester | null>;
  findAll(): Promise<Trimester[]>;
  create(trimester: Trimester): Promise<Trimester>;
  update(trimester: Trimester): Promise<Trimester>;
  delete(id: string): Promise<void>;
}

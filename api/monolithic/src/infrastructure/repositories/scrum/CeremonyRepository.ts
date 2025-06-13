import type { Ceremony } from "@domain/entities/scrum/Ceremony";

export interface CeremonyRepository {
  findAll(userId?: string): Promise<Ceremony[]>;
  findById(id: string): Promise<Ceremony | null>;
  create(
    ceremony: Omit<Ceremony, "id" | "createdAt" | "updatedAt">
  ): Promise<Ceremony>;
  update(
    id: string,
    ceremony: Partial<Omit<Ceremony, "id" | "createdAt" | "updatedAt">>
  ): Promise<Ceremony | null>;
  delete(id: string): Promise<void>;
}

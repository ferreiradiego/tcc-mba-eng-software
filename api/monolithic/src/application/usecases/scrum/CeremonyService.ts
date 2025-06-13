import type { Ceremony } from "@domain/entities/scrum/Ceremony";
import { PrismaCeremonyRepository } from "@infrastructure/repositories/scrum/PrismaCeremonyRepository";


export class CeremonyService {
  private ceremonyRepo: PrismaCeremonyRepository;
  constructor() {
    this.ceremonyRepo = new PrismaCeremonyRepository();
  }

  async listCeremonies(
    userId?: string,
    year?: number,
    number?: number
  ): Promise<Ceremony[]> {
    return this.ceremonyRepo.findAll(userId, year, number);
  }

  async getCeremony(id: string): Promise<Ceremony | null> {
    return this.ceremonyRepo.findById(id);
  }

  async createCeremony(
    data: Omit<Ceremony, "id" | "createdAt" | "updatedAt">
  ): Promise<Ceremony> {
    return this.ceremonyRepo.create(data);
  }

  async updateCeremony(
    id: string,
    data: Partial<Omit<Ceremony, "id" | "createdAt" | "updatedAt">>
  ): Promise<Ceremony | null> {
    return this.ceremonyRepo.update(id, data);
  }

  async deleteCeremony(id: string): Promise<void> {
    return this.ceremonyRepo.delete(id);
  }
}

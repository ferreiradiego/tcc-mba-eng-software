import { PrismaCeremonyRepository } from "@infrastructure/repositories/scrum/PrismaCeremonyRepository";

export class ReportCeremonyRepository {
  private ceremonyRepo = new PrismaCeremonyRepository();

  async findAllByUser(userId: string, year?: number, number?: number) {
    return this.ceremonyRepo.findAll(userId, year, number);
  }
}

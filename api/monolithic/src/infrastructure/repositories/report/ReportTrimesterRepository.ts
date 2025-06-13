import { PrismaTrimesterRepository } from "@infrastructure/repositories/scrum/PrismaTrimesterRepository";
import { PrismaClient } from "@prisma/client";

export class ReportTrimesterRepository {
  private trimesterRepo = new PrismaTrimesterRepository(new PrismaClient());

  async findAll() {
    return this.trimesterRepo.findAll();
  }

  async findById(id: string) {
    return this.trimesterRepo.findById(id);
  }
}

export {};

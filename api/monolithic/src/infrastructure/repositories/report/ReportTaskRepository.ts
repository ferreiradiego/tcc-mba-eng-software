import { PrismaTaskRepository } from "@infrastructure/repositories/scrum/PrismaTaskRepository";

export class ReportTaskRepository {
  private taskRepo = new PrismaTaskRepository();

  async findAllByUser(userId: string, year?: number, number?: number) {
    return this.taskRepo.findAll(userId, year, number);
  }
}

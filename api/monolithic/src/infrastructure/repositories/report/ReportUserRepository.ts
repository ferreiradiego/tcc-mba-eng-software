import { PrismaUserRepository } from "@infrastructure/repositories/auth/PrismaUserRepository";

export class ReportUserRepository {
  private userRepo = new PrismaUserRepository();

  async getUserById(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (user) return user;
    return { id: userId, name: "Usuário não encontrado" };
  }
}

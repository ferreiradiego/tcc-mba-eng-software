import axios from "axios";

// TODO: verificar se é melhor bater diretamente no microservico, ou bater no gateway
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:4001";

export class ReportUserRepository {
  async getUserById(userId: string, token: string) {
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data && response.data.id === userId) {
      return response.data;
    }

    return { id: userId, name: "Usuário não encontrado" };
  }
}

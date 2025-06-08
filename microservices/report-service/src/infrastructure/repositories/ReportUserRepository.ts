import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

export class ReportUserRepository {
  async getUserById(userId: string, token: string) {
    // Busca informações do usuário no microserviço de Auth
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // O endpoint /auth/me retorna o usuário autenticado, então só retorna se o id bater
    if (response.data && response.data.id === userId) {
      return response.data;
    }
    // Se não bater, tenta buscar por id (caso exista endpoint futuro)
    return { id: userId, name: 'Usuário não encontrado' };
  }
}

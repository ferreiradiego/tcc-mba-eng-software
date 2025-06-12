import axios from "axios";

const SCRUM_SERVICE_URL =
  process.env.SCRUM_SERVICE_URL || "http://localhost:4002";

export class ReportCeremonyRepository {
  async findAllByUser(userId: string, token: string) {
    const response = await axios.get(`${SCRUM_SERVICE_URL}/ceremonies`, {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}

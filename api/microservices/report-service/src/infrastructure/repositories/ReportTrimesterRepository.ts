import axios from "axios";

const SCRUM_SERVICE_URL = process.env.SCRUM_SERVICE_URL || "http://localhost:4002";

export class ReportTrimesterRepository {
  async findAll(token: string) {
    const response = await axios.get(`${SCRUM_SERVICE_URL}/trimesters`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
  async findById(id: string, token: string) {
    const response = await axios.get(`${SCRUM_SERVICE_URL}/trimesters/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}

export {};

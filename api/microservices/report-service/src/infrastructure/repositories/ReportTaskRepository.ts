import axios from "axios";

const TASK_SERVICE_URL =
  process.env.TASK_SERVICE_URL || "http://localhost:3002";

export class ReportTaskRepository {
  async findAllByUser(userId: string, token: string) {
    const response = await axios.get(`${TASK_SERVICE_URL}/tasks`, {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}

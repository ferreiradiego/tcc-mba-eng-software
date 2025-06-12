import axios from "axios";

const TASK_SERVICE_URL =
  process.env.SCRUM_SERVICE_URL || "http://localhost:4002";

export class ReportTaskRepository {
  async findAllByUser(
    userId: string,
    token: string,
    year?: number,
    number?: number
  ) {
    const params: any = { userId };
    if (year) params.year = year;
    if (number) params.number = number;
    const response = await axios.get(`${TASK_SERVICE_URL}/tasks`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}

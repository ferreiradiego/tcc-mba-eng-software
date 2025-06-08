import axios from 'axios';

const TIMELOG_SERVICE_URL = process.env.TIMELOG_SERVICE_URL || 'http://localhost:3003';

export class ReportTimeLogRepository {
  async findAllByUser(userId: string, token: string) {
    const response = await axios.get(`${TIMELOG_SERVICE_URL}/timelogs`, {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
}

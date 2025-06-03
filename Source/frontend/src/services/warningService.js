import { api } from './api';

export const warningService = {
  // Lấy danh sách cảnh báo
  async getWarningLogs(limit = 10) {
    try {
      const response = await api.get(`/log-warning/logs/top?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top warning logs:', error);
      throw error;
    }
  }
};

export const getWarningLogsV2 = async ({ cursor, limit, from, to, order, type }) => {
  const params = new URLSearchParams();
  if (cursor !== undefined) params.append('cursor', String(cursor));
  if (limit !== undefined) params.append('limit', String(limit));
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  if (order) params.append('order', order);
  if (type) params.append('type', type);

  try {
    const response = await api.get(`/log-warning/logs?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching warning logs (v2):', error);
    return { success: false, message: error.response?.data?.message || 'Lỗi kết nối API', data: null };
  }
}; 
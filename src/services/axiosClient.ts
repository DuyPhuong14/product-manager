import axios, { AxiosError } from 'axios';
import { getToken, removeToken } from '../utils/token';

// Lỗi đã được chuẩn hóa, UI chỉ cần đọc .message
export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Dữ liệu gửi lên không hợp lệ',
  401: 'Phiên đăng nhập đã hết hạn',
  403: 'Bạn không có quyền thực hiện thao tác này',
  404: 'Không tìm thấy dữ liệu',
  500: 'Lỗi máy chủ, vui lòng thử lại sau',
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // lấy từ .env
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: tự gắn token vào mọi request
axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: xử lý lỗi chung ở một chỗ
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Không có response: mất mạng, API chết, hoặc timeout
    if (!error.response) {
      const message =
        error.code === 'ECONNABORTED'
          ? 'Yêu cầu quá thời gian chờ, vui lòng thử lại'
          : 'Không thể kết nối tới máy chủ. Hãy kiểm tra mạng hoặc API';
      return Promise.reject(new ApiError(message));
    }

    const { status } = error.response;
    if (status === 401) removeToken(); // token hết hạn thì xóa (nếu có trang login thì điều hướng tại đây)

    return Promise.reject(new ApiError(STATUS_MESSAGES[status] ?? `Có lỗi xảy ra (mã ${status})`, status));
  },
);

export default axiosClient;
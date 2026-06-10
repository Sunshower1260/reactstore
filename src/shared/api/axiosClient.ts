import axios from 'axios';

// Thay đổi URL này thành URL của API Gateway hoặc BFF của bạn
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, // Có thể thiết lập timeout nếu cần
});

// Thêm một request interceptor (Ví dụ: để tự động đính kèm token)
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage hoặc cookies ở đây
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm một response interceptor (Ví dụ: để xử lý lỗi chung 401, 403)
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp data nếu API thiết kế theo dạng bọc data
    // return response.data;
    return response;
  },
  (error) => {
    // Xử lý lỗi tập trung ở đây (vd: đẩy ra toast notification, redirect về trang login)
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

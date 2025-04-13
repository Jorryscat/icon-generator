import axios from "axios";
// const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const api = axios.create({
  baseURL: "http://localhost:5000/api", // API 基础 URL
  timeout: 5000, // 请求超时时间
});

// 请求拦截器（可选）
api.interceptors.request.use(
  (config) => {
    // 在发送请求之前可以添加一些逻辑
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（可选）
api.interceptors.response.use(
  (response) => {
    return response.data; // 直接返回响应数据
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

interface FailedQueueItem {
  resolve: (value: any) => void;
  reject: (err: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, success: boolean = false) => {
  failedQueue.forEach((prom) => {
    if (success) {
      prom.resolve(true);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject: (err: unknown) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:3001/api"}/auth/refresh`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          processQueue(null, true);
          return api(originalRequest);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (err) {
        processQueue(err, false);
        
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:3001/api"}/auth/logout`,
            {},
            {
              withCredentials: true,
            }
          );
        } catch (logoutError) {
          // Ignore logout errors
        }
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};


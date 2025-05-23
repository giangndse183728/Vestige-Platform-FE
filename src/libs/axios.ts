import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL  || "http://localhost:8000/api/v1", 
  withCredentials: true,  
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

  
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/accounts/refresh-token`,
          {},  
          { 
            withCredentials: true,  
          }
        );


        if (response.data.result.accessToken) {
          localStorage.setItem('token', response.data.result.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.result.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
    
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

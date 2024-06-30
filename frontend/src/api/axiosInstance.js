import axios from 'axios';
import { GatewayUrl } from '../components/const/urls';

const createAxiosInstance = (token) => {
  const axiosInstance = axios.create({
    baseURL: GatewayUrl,
  });

  // Add a request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

let currentToken = null;

export const setApiToken = (token) => {
  currentToken = token;
};

api.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

export default api;

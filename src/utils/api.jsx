import axios from 'axios';

// Dev: Vite proxy forwards /api/* → http://localhost:3000 (no CORS)
// Prod: set VITE_API_URL to your backend URL
const API_URL = import.meta.env.VITE_API_URL || `https://festmate-3sd9.onrender.com`;

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token to every outgoing request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const get = (path, config) => client.get(path, config).then(r => r.data);
export const post = (path, data, config) => client.post(path, data, config).then(r => r.data);
export const put = (path, data, config) => client.put(path, data, config).then(r => r.data);
export const patch = (path, data, config) => client.patch(path, data, config).then(r => r.data);
export const remove = (path, data,config) => client.delete(path, data,config).then(r => r.data);

export default { client, get, post, put, patch, remove };

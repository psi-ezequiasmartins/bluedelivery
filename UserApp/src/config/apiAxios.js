/**
 * src/config/apiAxios.js
 */

import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, NODE_ENV } from '@env';

const isDevelopment = NODE_ENV === 'development';

if (isDevelopment) console.log('Ambiente de desenvolvimento detectado. Habilitando logs detalhados.');

const API_URL = (BASE_URL || 'https://server.bluedelivery.tech').replace(/^"(.*)"$/, '$1');

if (isDevelopment) console.log('URL da API:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  validateStatus(status) {
    return status >= 200 && status < 300;
  }
});

api.ping = async () => {
  try {
    const response = await api.get('/api/ping');
    if (isDevelopment) console.log('Conexão com o servidor:', { data: response.data });
    return response.status === 200;
  } catch (error) {
    if (error.response?.status === 401) console.warn('Acesso não autorizado à rota /api/ping.');
    else console.error('Erro de conectividade:', { message: error.message, status: error.response?.status, data: error.response?.data });
    return false;
  }
};

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => {
  if (isDevelopment) {
    try {
      const cleanData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      if (response.status === 200) console.log('Resposta OK:', response.config.url);
      else console.warn('Resposta não-200:', response.status, response.config.url, JSON.stringify(cleanData).slice(0, 300));
    } catch (e) {
      // silencioso
    }
  }
  return response;
}, (error) => {
  console.error('Erro na resposta:', error.message);
  return Promise.reject(error);
});

export default api;

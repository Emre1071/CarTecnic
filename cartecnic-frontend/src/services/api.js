import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7076/api' // portu backend'e göre ayarla
});

export default api;

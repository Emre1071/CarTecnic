import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7009/api' // ✅ doğru olan bu
});


export default api;

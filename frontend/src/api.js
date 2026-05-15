import axios from 'axios';

// Create an Axios instance
const isProduction = window.location.hostname !== 'localhost';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://spotty-bushes-scream.loca.lt',
  headers: {
    'Bypass-Tunnel-Reminder': 'true',
  }
});

export default api;

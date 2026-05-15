import axios from 'axios';

// Create an Axios instance
const isProduction = window.location.hostname !== 'localhost';

const api = axios.create({
  // Use the VITE_API_URL if provided, else default to localhost for local dev
  baseURL: import.meta.env.VITE_API_URL || (isProduction ? '' : 'http://localhost:5000'),
});

export default api;

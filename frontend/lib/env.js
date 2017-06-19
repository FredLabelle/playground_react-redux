const isProduction = process.env.NODE_ENV === 'production';

const developmentBackendUrl = process.browser ? 'http://localhost:8080' : 'http://backend:8080';

export const BACKEND_URL = isProduction
  ? 'https://investorx.efounders.co/api'
  : developmentBackendUrl;

export const FRONTEND_URL = isProduction
  ? 'https://investorx.efounders.co'
  : 'http://localhost:3000';

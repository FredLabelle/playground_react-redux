const isDevelopment = process.env.NODE_ENV === 'development';

export const BACKEND_URL_BROWSER = isDevelopment ? 'http://localhost:8080' : '/api';

const developmentBackendUrl = process.browser ? 'http://localhost:8080' : 'http://backend:8080';

const getBackendUrl = () => {
  if (process.browser) {
    return `${window.location.origin}/api`;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://investorx.efounders.co/api'
    : 'https://investorx-staging.efounders.co/api';
};

export const BACKEND_URL = isDevelopment ? developmentBackendUrl : getBackendUrl();

const getFrontendUrl = () => {
  if (process.browser) {
    return window.location.origin;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://investorx.efounders.co'
    : 'https://investorx-staging.efounders.co';
};

export const FRONTEND_URL = isDevelopment ? 'http://localhost:3000' : getFrontendUrl();

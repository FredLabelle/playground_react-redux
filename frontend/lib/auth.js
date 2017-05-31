import { BACKEND_URL } from './env';

const post = (url, body) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(response => response.json());

export const signup = body => post(`${BACKEND_URL}/auth/local/signup`, body);

export const login = body => post(`${BACKEND_URL}/auth/local/login`, body);

export const logout = () => post(`${BACKEND_URL}/auth/local/logout`, {});

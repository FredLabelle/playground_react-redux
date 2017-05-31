import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../lib/auth';

export const login = body => ({
  type: 'LOGIN',
  payload: apiLogin(body),
});

export const signup = body => ({
  type: 'SIGNUP',
  payload: apiSignup(body),
});

export const logout = () => ({
  type: 'LOGOUT',
  payload: apiLogout(),
});

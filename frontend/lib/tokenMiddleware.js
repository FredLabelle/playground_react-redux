import { Cookies } from 'react-cookie';

const cookies = process.browser && new Cookies();

export default store => next => action => {
  const { organizationShortId } = store.getState().router;
  const { type, payload } = action;
  if (type === 'SIGNUP_FULFILLED' || type === 'LOGIN_FULFILLED') {
    if (payload.success) {
      cookies.set('token', payload.token, { path: '/' });
      location.replace(`/organization/${organizationShortId}`);
    }
  } else if (type === 'LOGOUT_FULFILLED') {
    if (payload.success) {
      cookies.remove('token', { path: '/' });
      location.replace(`/organization/${organizationShortId}/login`);
    }
  }
  next(action);
};

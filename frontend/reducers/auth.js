const initialState = {
  loading: false,
  error: false,
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case 'SIGNUP_PENDING': case 'LOGIN_PENDING': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'SIGNUP_FULFILLED': case 'LOGIN_FULFILLED': {
      return {
        ...state,
        loading: false,
        error: !payload.success,
      };
    }
    case 'SIGNUP_REJECTED': case 'LOGIN_REJECTED': {
      return {
        ...state,
        error: true,
      };
    }
    default: {
      return state;
    }
  }
};

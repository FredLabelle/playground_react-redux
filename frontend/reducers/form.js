const initialState = {
  unsavedChanges: false,
  passwordsMismatch: false,
  passwordTooWeak: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_UNSAVED_CHANGES': {
      return {
        ...state,
        unsavedChanges: payload,
      };
    }
    case 'SET_PASSWORDS_MISMATCH': {
      return {
        ...state,
        passwordsMismatch: payload,
      };
    }
    case 'SET_PASSWORD_TOO_WEAK': {
      return {
        ...state,
        passwordTooWeak: payload,
      };
    }
    default: {
      return state;
    }
  }
};

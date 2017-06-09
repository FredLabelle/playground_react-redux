const initialState = {
  unsavedChanges: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_UNSAVED_CHANGES': {
      return { unsavedChanges: payload };
    }
    default: {
      return state;
    }
  }
};

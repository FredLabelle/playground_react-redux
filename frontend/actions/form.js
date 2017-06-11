export const setUnsavedChanges = unsavedChanges => ({
  type: 'SET_UNSAVED_CHANGES',
  payload: unsavedChanges,
});

export const setPasswordsMismatch = passwordsMismatch => ({
  type: 'SET_PASSWORDS_MISMATCH',
  payload: passwordsMismatch,
});

export const setPasswordTooWeak = passwordTooWeak => ({
  type: 'SET_PASSWORD_TOO_WEAK',
  payload: passwordTooWeak,
});

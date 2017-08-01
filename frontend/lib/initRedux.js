/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import Router from 'next/router';
import { reducer as toastrReducer } from 'react-redux-toastr';

import reducers from '../reducers';
import { onRouteChangeStart } from '../actions/router';
import { setUnsavedChanges } from '../actions/form';

const devTools =
  process.browser && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f;

const create = (apollo, initialState = {}) =>
  createStore(
    combineReducers({
      ...reducers,
      toastr: toastrReducer,
      apollo: apollo.reducer(),
    }),
    initialState,
    compose(applyMiddleware(apollo.middleware()), devTools),
  );

let reduxStore;

const initRedux = (apollo, initialState) => {
  if (!process.browser) {
    return create(apollo, initialState);
  }
  if (!reduxStore) {
    reduxStore = create(apollo, initialState);
  }
  return reduxStore;
};

Router.onRouteChangeStart = url => {
  if (!reduxStore) {
    return;
  }
  reduxStore.dispatch(onRouteChangeStart(url));
  reduxStore.dispatch(setUnsavedChanges(false));
};

export const getReduxStore = () => reduxStore;

export default initRedux;

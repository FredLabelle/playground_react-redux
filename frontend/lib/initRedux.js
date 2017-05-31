/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import Router from 'next/router';

import reducers from '../reducers';
import tokenMiddleware from './tokenMiddleware';
import { onRouteChangeStart } from '../actions/router';

const devTools = process.browser && window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION__()
  : f => f;

const create = (apollo, initialState = {}) => {
  const middlewares = [apollo.middleware(), tokenMiddleware, promiseMiddleware()];
  return createStore(
    combineReducers({
      ...reducers,
      apollo: apollo.reducer(),
    }),
    initialState,
    compose(applyMiddleware(...middlewares), devTools),
  );
};

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
};

export const getReduxStore = () => reduxStore;

export default initRedux;

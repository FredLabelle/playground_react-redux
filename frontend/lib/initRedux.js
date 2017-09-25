import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import Router from 'next/router';
import { reducer as toastrReducer } from 'react-redux-toastr';

import reducers from '../reducers';
import { onRouteChangeStart } from '../actions/router';
import { setUnsavedChanges } from '../actions/form';

// eslint-disable-next-line no-underscore-dangle
const reduxDevToolsExtension = process.browser && window.__REDUX_DEVTOOLS_EXTENSION__;
const devTools = reduxDevToolsExtension ? reduxDevToolsExtension() : f => f;

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

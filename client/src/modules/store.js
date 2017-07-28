import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import { autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './rootReducer';

function configureStore(initialState, { middleware }) {
  // Enable Redux DevTools = composeWithDevTools
  const enhancers = composeWithDevTools(

    // Enable save/load state from local storage
    autoRehydrate(),
    applyMiddleware(

      // Thunk middleware + api - it will be passed as an argument in thunk callbacks
      thunkMiddleware.withExtraArgument({}),

      // enable promise middleware with custom suffixes
      promiseMiddleware({ promiseTypeSuffixes: ['PENDING', 'OK', 'FAIL'] }),
      ...middleware,
    ),
  );

  const store = createStore(rootReducer, enhancers);

  // This should enable hot reloading for redux store
  // TODO: still see warnings in console, doesn't seem to work
  if (process.env.NODE_ENV === 'development' && module.hot) {
    // Enable Webpack hot module replacement for reducers. This is so that we
    // don't lose all of our current application state during hot reloading.
    module.hot.accept('./rootReducer', () => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('./rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;

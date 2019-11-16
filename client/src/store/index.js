import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';

import rootReducer from './reducers';
const middlewares = [thunk];

const initialState = {};
let store;

if (process.env.NODE_ENV === 'production') {
  store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middlewares))
  );
} else {
  store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
}

export default store;

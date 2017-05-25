import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers';

const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware)
);

if (process.env.NODE_ENV === 'development' && typeof window !== undefined) {
  window.store = store;
}

export default store;

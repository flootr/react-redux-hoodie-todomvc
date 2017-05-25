import { combineReducers } from 'redux';
import unionBy from 'lodash/unionBy';

function todos(state = [], action) {
  switch (action.type) {
    case 'INIT_TODOS':
      return [...action.payload];
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'REMOVE_TODO':
      return [...state.filter(todo => todo._id !== action.payload)];
    case 'REMOVE_TODOS':
      return [...state.filter(todo => action.payload.indexOf(todo._id) === -1)];
    case 'UPDATE_TODO':
      return [...state.map(todo => todo._id === action.payload._id ? action.payload : todo)];
    case 'UPDATE_TODOS':
      return unionBy(action.payload, state, '_id');
    default:
      return state;
  }
}

export default combineReducers({
  todos
});

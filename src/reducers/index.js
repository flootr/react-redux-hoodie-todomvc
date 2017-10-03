import { combineReducers } from 'redux';
import orderBy from 'lodash/orderBy'

function todos(state = [], action) {
  switch (action.type) {
    case 'INIT_TODOS':
      return [...action.payload];
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'REMOVE_TODO':
      return [...state.filter(todo => todo._id !== action.payload._id)];
    case 'UPDATE_TODO':
      return [...state.map(todo => todo._id === action.payload._id ? action.payload : todo)];
    default:
      return state;
  }
}

export function getVisibleTodos(todos, filter) {
  return orderBy(todos, ['hoodie.createdAt', 'desc']).filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });
}

export default combineReducers({
  todos
});

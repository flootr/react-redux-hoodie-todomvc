import { combineReducers } from 'redux';

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
  return todos.filter(todo => {
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

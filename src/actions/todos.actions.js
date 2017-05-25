import hoodie from '../hoodie';

export const initTodos = (payload) => ({ type: 'INIT_TODOS', payload });
export const addTodo = (payload) => ({ type: 'ADD_TODO', payload });
export const removeTodo = (payload) => ({ type: 'REMOVE_TODO', payload });
export const updateTodo = (payload) => ({ type: 'UPDATE_TODO', payload });

export const fetchTodos = () => async (dispatch) => {
  const todos = await hoodie.store.findAll();
  dispatch(initTodos(todos));
}

export const storeTodo = (payload) => () => hoodie.store.add(payload);
export const deleteTodo = (payload) => () => hoodie.store.remove(payload);
export const editTodo = (_id, text) => () => hoodie.store.update(_id, { todo: text });
export const toggleTodo = (todo) => () => hoodie.store.update(todo._id, { completed: !todo.completed });
export const toggleAllTodos = (checked) => async (dispatch, getState) => {
  const allTodos = getState().todos;
  return hoodie.store.update(allTodos, { completed: checked });
}

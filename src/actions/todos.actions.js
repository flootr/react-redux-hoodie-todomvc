import hoodie from '../hoodie';

export const initTodos = (payload) => ({ type: 'INIT_TODOS', payload });
export const addTodo = (payload) => ({ type: 'ADD_TODO', payload });
export const removeTodo = (payload) => ({ type: 'REMOVE_TODO', payload });
export const removeTodos = (payload) => ({ type: 'REMOVE_TODOS', payload });
export const updateTodo = (payload) => ({ type: 'UPDATE_TODO', payload });
export const updateTodos = (payload) => ({ type: 'UPDATE_TODOS', payload });

export const fetchTodos = () => async (dispatch) => {
  const todos = await hoodie.store.findAll();
  dispatch(initTodos(todos));
}

export const storeTodo = (payload) => async (dispatch) => {
  const todo = await hoodie.store.add(payload);
  dispatch(addTodo(todo));
};

export const deleteTodo = (payload) => async (dispatch) => {
  const todo = await hoodie.store.remove(payload);

  if (Array.isArray(todo)) {
    dispatch(removeTodos(todo.map(todo => todo._id)));
    return;
  }

  dispatch(removeTodo(todo._id));
}

export const editTodo = (_id, text) => async (dispatch) => {
  const updatedTodo = await hoodie.store.update(_id, { todo: text });
  dispatch(updateTodo(updatedTodo));
}

export const toggleTodo = (todo) => async (dispatch) => {
  const updatedTodo = await hoodie.store.update(todo._id, { completed: !todo.completed });
  dispatch(updateTodo(updatedTodo));
}

export const toggleAllTodos = (checked) => async (dispatch, getState) => {
  const allTodos = getState().todos;
  const updatedTodos = await hoodie.store.update(allTodos, { completed: checked });

  dispatch(updateTodos(updatedTodos));
}

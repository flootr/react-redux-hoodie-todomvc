import React, { Component } from 'react';
import { func } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchTodos, storeTodo, deleteTodo, toggleTodo, toggleAllTodos, editTodo } from '../actions/todos.actions';
import { getVisibleTodos } from '../reducers';
import TodoItem from '../components/todoItem';
import Footer from '../components/footer';
import { withHoodie } from '../hoodie';

class App extends Component {
  state = {
    todo: '',
    editing: null
  }

  componentDidMount() {
    this.props.fetchTodos();
  }

  handleChange = (id) => (e) => {
    e.preventDefault();

    const value = e.target.value;
    this.setState({ [id]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.storeTodo({ todo: this.state.todo });
    this.setState({ todo: '' });
  }

  destroy = (id) => (e) => {
    e.preventDefault();

    this.props.deleteTodo(id);
  }

  toggle = (todo) => (e) => {
    this.props.toggleTodo(todo);
  }

  toggleAll = (e) => {
    const checked = e.target.checked;
    this.props.toggleAllTodos(checked);
  }

  edit = (id) => () => {
    this.setState({ editing: id });
  }

  save = (id) => (text) => {
    this.props.editTodo(id, text);
    this.setState({ editing: null });
  }

  cancel = () => {
    this.setState({ editing: null });
  }

  clearCompleted = () => {
    this.props.deleteTodo(this.props.todos.filter(todo => todo.completed));
  }

  render() {
    const { todos, activeTodos, completedTodos, match: { params: { filter } } } = this.props;

    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <form onSubmit={this.handleSubmit}>
            <input className="new-todo" placeholder="What needs to be done?" autoFocus value={this.state.todo} onChange={this.handleChange('todo')} />
          </form>
        </header>
        <section className="main">
          { (activeTodos + completedTodos) > 0 && (
            <div>
              <input id="toggle-all" type="checkbox" className="toggle-all" checked={activeTodos === 0} onChange={this.toggleAll}/>
              <label htmlFor="toggle-all">Mark all as complete</label>
            </div>
          ) }
          <ul className="todo-list">
            {todos.map(todo => (
              <TodoItem
                editing={this.state.editing === todo._id}
                key={todo._id}
                todo={todo}
                onDestroy={this.destroy(todo._id)}
                onToggle={this.toggle(todo)}
                onEdit={this.edit(todo._id)}
                onSave={this.save(todo._id)}
                onCancel={this.cancel}
              />
            ))}
          </ul>
        </section>
        {(activeTodos || completedTodos) ? <Footer onClearCompleted={this.clearCompleted} activeTodos={activeTodos} completedTodos={completedTodos} filter={filter} /> : ''}
      </section>
    )
  }
}

App.propTypes = {
  fetchTodos: func.isRequired,
  storeTodo: func.isRequired,
  deleteTodo: func.isRequired,
  toggleTodo: func.isRequired,
  toggleAllTodos: func.isRequired,
  editTodo: func.isRequired
};

const mapStateToProps = (state, props) => {
  const filter = props.match.params.filter;

  return {
    todos: getVisibleTodos(state.todos, filter),
    activeTodos: state.todos.reduce((acc, todo) => todo.completed ? acc : acc + 1, 0),
    completedTodos: state.todos.reduce((acc, todo) => todo.completed ? acc + 1 : acc, 0)
  };
}

const mapDispatchToProps = {
  fetchTodos,
  storeTodo,
  deleteTodo,
  toggleTodo,
  toggleAllTodos,
  editTodo
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHoodie
);

export default enhance(App);

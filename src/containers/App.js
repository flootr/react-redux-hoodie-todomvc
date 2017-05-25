import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { fetchTodos, storeTodo, deleteTodo, toggleTodo, toggleAllTodos, editTodo } from '../actions/todos.actions';
import './App.css';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class App extends Component {
  state = {
    todo: '',
    editing: null,
    editText: ''
  }

  componentDidMount() {
    this.props.fetchTodos();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      const editField = this.editField;
      editField.focus();
      editField.setSelectionRange(editField.value.length, editField.value.length);
    }
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

  handleDestroy = (id) => (e) => {
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

  handleEdit = (id, text) => () => {
    this.setState({ editing: id, editText: text });
  }

  handleEditKeyDown = (e) => {
    if (e.which === ESCAPE_KEY) {
      this.handleEditCancel();
      return;
    }

    if (e.which === ENTER_KEY) {
      this.handleEditSave();
    }
  }

  handleEditBlur = () => {
    const value = this.state.editText.trim();

    value ? this.handleEditSave() : this.handleEditCancel();
  }

  handleEditSave = () => {
    this.props.editTodo(this.state.editing, this.state.editText);
    this.setState({ editing: null, editText: '' });
  }

  handleEditCancel = () => {
    this.setState({ editing: null, editText: '' })
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
          { todos.length > 0 && (
            <div>
              <input id="toggle-all" type="checkbox" className="toggle-all" checked={activeTodos === 0} onChange={this.toggleAll}/>
              <label htmlFor="toggle-all">Mark all as complete</label>
            </div>
          ) }
          <ul className="todo-list">
            {todos.map(todo => (
              <li key={todo._id} className={cx({ completed: todo.completed, editing: this.state.editing === todo._id })}>
                <div className="view">
                  <input type="checkbox" className="toggle" checked={!!todo.completed} onChange={this.toggle(todo)}/>
                  <label onDoubleClick={this.handleEdit(todo._id, todo.todo)}>{todo.todo}</label>
                  <button className="destroy" onClick={this.handleDestroy(todo._id)}></button>
                </div>
                { this.state.editing === todo._id && <input
                  ref={(editField) => this.editField = editField}
                  className="edit"
                  value={this.state.editText}
                  onChange={this.handleChange('editText')}
                  onBlur={this.handleEditBlur}
                  onKeyDown={this.handleEditKeyDown}
                /> }
              </li>
            ))}
          </ul>
        </section>
        { (activeTodos || completedTodos) ? (
          <footer className="footer">
            <span className="todo-count"><strong>{todos.length}</strong> { todos.length > 1 ? 'items' : 'item'} left</span>
            <ul className="filters">
              <li>
                <Link to="/" className={cx({ selected: !filter })}>All</Link>
              </li>
              <li>
                <Link to="/active" className={cx({ selected: filter === 'active' })}>Active</Link>
              </li>
              <li>
                <Link to="/completed" className={cx({ selected: filter === 'completed' })}>Completed</Link>
              </li>
            </ul>
            { completedTodos > 0 && <button className="clear-completed" onClick={this.clearCompleted}>Clear completed</button> }
          </footer>
        ) : '' }
      </section>
    );
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

function getVisibleTodos(todos, filter) {
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

export default connect(mapStateToProps, mapDispatchToProps)(App);

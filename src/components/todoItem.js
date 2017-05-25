import React, { Component } from 'react';
import cx from 'classnames';
import { shape, string, bool, func } from 'prop-types';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class TodoItem extends Component {
  state = {
    editText: ''
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.editing && this.props.editing) {
      const editField = this.editField;
      editField.focus();
      editField.setSelectionRange(editField.value.length, editField.value.length);
    }
  }

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ editText: value });
  }

  handleEdit = () => {
    this.props.onEdit();
    this.setState({ editText: this.props.todo.todo });
  }

  handleEditKeyDown = (event) => {
    if (event.which === ESCAPE_KEY) {
      this.handleEditCancel();
      return;
    }

    if (event.which === ENTER_KEY) {
      this.handleEditSave();
    }
  }

  handleEditSave = () => {
    const value = this.state.editText.trim();

    if (value) {
      this.props.onSave(value);
      this.setState({ editText: value });
      return;
    }

    this.handleEditCancel();
  }

  handleEditCancel = () => {
    this.setState({ editText: this.props.todo.todo });
    this.props.onCancel();
  }

  render() {
    const { todo, editing } = this.props;

    return (
      <li key={todo._id} className={cx({ completed: todo.completed, editing })}>
        <div className="view">
          <input type="checkbox" className="toggle" checked={!!todo.completed} onChange={this.props.onToggle}/>
          <label onDoubleClick={this.handleEdit}>{todo.todo}</label>
          <button className="destroy" onClick={this.props.onDestroy}></button>
        </div>
        { this.props.editing && <input
          ref={(editField) => this.editField = editField}
          className="edit"
          value={this.state.editText}
          onChange={this.handleChange}
          onBlur={this.handleEditSave}
          onKeyDown={this.handleEditKeyDown}
        /> }
      </li>
    );
  }
}

TodoItem.propTypes = {
  todo: shape({
    _id: string.isRequired,
    todo: string.isRequired,
    completed: bool
  }).isRequired,
  editing: bool,
  onToggle: func.isRequired,
  onEdit: func.isRequired,
  onDestroy: func.isRequired
}

export default TodoItem;

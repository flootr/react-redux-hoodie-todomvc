import Hoodie from '@hoodie/client';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PouchDB from 'pouchdb';
import { addTodo, removeTodo, updateTodo } from './actions/todos.actions';

const hoodie = new Hoodie({
  url: process.env.HOODIE_URL || 'http://localhost:8080',
  PouchDB
});

export default hoodie;

export const withHoodie = (BaseComponent) => {
  class HoodieWrapper extends Component {
    _handleChange = (type, doc) => {
      if (type === 'add') {
        this.props.addTodo(doc);
        return;
      }

      if (type === 'remove') {
        this.props.removeTodo(doc);
        return;
      }

      if (type === 'update') {
        this.props.updateTodo(doc);
        return;
      }
    };

    componentDidMount() {
      hoodie.store.on('change', this._handleChange);
    }

    componentWillUnmount() {
      hoodie.store.off('change', this._handleChange);
    }

    render() {
      return (
        <BaseComponent {...this.props} />
      );
    }
  }

  const mapDispatchToProps = {
    addTodo,
    removeTodo,
    updateTodo
  }

  return connect(null, mapDispatchToProps)(HoodieWrapper);
}

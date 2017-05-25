import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { func, string, number } from 'prop-types';

function Footer({ activeTodos, completedTodos, onClearCompleted, filter }) {
  return (
    <footer className="footer">
      <span className="todo-count"><strong>{activeTodos}</strong> { activeTodos > 1 ? 'items' : 'item'} left</span>
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
      { completedTodos > 0 && <button className="clear-completed" onClick={onClearCompleted}>Clear completed</button> }
    </footer>
  )
}

Footer.propTypes = {
  onClearCompleted: func.isRequired,
  filter: string,
  completedTodos: number.isRequired,
  activeTodos: number.isRequired
}

export default Footer;

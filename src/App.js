import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('All'); // "All", "Pending", "Completed"
  const [editId, setEditId] = useState(null); // ID of the task being edited
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addOrEditTodo = () => {
    if (!title || !description || !dueDate) return;

    if (editId) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editId
            ? { ...todo, title, description, priority, dueDate }
            : todo
        )
      );
      setEditId(null);
    } else {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          title,
          description,
          priority,
          dueDate,
          completed: false,
        },
      ]);
    }

    setTitle('');
    setDescription('');
    setPriority('Low');
    setDueDate('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEdit = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    setTitle(todo.title);
    setDescription(todo.description);
    setPriority(todo.priority);
    setDueDate(todo.dueDate);
    setEditId(id);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'Pending') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <header>
        <h1>My Todos</h1>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </div>
          <div className="todo-input-item">
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="todo-input-item">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="todo-input-item">
            <button className="primaryBtn" onClick={addOrEditTodo}>
              {editId ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
            onClick={() => setFilter('All')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
            onClick={() => setFilter('Pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
            onClick={() => setFilter('Completed')}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-list-item ${
                  todo.completed ? 'completed' : ''
                }`}
              >
                <h3>
                  {todo.title}{' '}
                  <span className={`priority ${todo.priority.toLowerCase()}`}>
                    {todo.priority}
                  </span>
                </h3>
                <p>{todo.description}</p>
                <p>
                  <strong>Due:</strong> {todo.dueDate}
                </p>
                <div className="todo-actions">
                  <button onClick={() => toggleComplete(todo.id)}>
                    {todo.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => startEdit(todo.id)}>Edit</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-todos">No tasks to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

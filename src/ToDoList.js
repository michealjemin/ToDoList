import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTask, setEditingTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks');
        setLoading(false);
      });
  }, []);

  const handleChange = (event) => setNewTask(event.target.value);
  const handleEditingChange = (event) => setEditingTask(event.target.value);

  const addTask = () => {
    if (newTask.trim() !== '') {
      axios.post('http://localhost:5000/api/tasks', { task: newTask })
        .then((response) => {
          setTasks([...tasks, response.data]);
          setNewTask('');
          setError('');
        })
        .catch((error) => {
          console.error('Error adding task:', error);
          setError('Failed to add task');
        });
    } else {
      setError('Task cannot be empty');
    }
  };

  const updateTask = (id) => {
    axios.put(`http://localhost:5000/api/tasks/${id}`, { task: editingTask })
      .then((response) => {
        const updatedTasks = tasks.map((task) => (task._id === id ? response.data : task));
        setTasks(updatedTasks);
        setEditingIndex(null);
        setEditingTask('');
        setError('');
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        setError('Failed to update task');
      });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
        setError('');
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        setError('Failed to delete task');
      });
  };

  const startEditing = (index) => {
    setEditingTask(tasks[index].task);
    setEditingIndex(index);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (editingIndex !== null) {
        updateTask(tasks[editingIndex]._id);
      } else {
        addTask();
      }
    }
  };

  return (
    <>
    <div className="todo-list">
      <h1>To-Do List</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="task-container">
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            placeholder="Enter the Task..."
            value={newTask}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={addTask}>Add Task</button>
          <ol>
            {tasks.map((task, index) => (
              <li key={task._id}>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editingTask}
                    onChange={handleEditingChange}
                    onKeyDown={(e) => e.key === 'Enter' && updateTask(task._id)}
                    onBlur={() => {
                      setEditingIndex(null);
                      setEditingTask('');
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <span onDoubleClick={() => startEditing(index)}>{task.task}</span>
                    <button onClick={() => deleteTask(task._id)}>Delete</button>
                  </>
                 )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
   
    </>
  );
};

export default ToDoList;

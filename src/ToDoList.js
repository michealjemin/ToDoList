import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@radix-ui/react-accordion';
import './index.css'; 

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTask, setEditingTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/tasks')
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

  const addTask = () => {
    if (newTask.trim() !== '') {
      axios
        .post('http://localhost:5000/api/tasks', { task: newTask })
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
    axios
      .put(`http://localhost:5000/api/tasks/${id}`, { task: editingTask })
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
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`)
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

  const task = [
    { _id: '1', task: 'Buy groceries' },
    { _id: '2', task: 'Finish project report' },
    { _id: '3', task: 'Clean the house' },
    { _id: '4', task: 'Prepare dinner' },
    { _id: '5', task: 'Call the dentist' },
    { _id: '6', task: 'Read a book' },
    { _id: '7', task: 'Attend yoga class' },
    { _id: '8', task: 'Send emails' },
    { _id: '9', task: 'Plan weekend trip' },
    { _id: '10', task: 'Organize files' },
  ];
  

  return (
    <>
      <h1 className="text-2xl text-red-500">To-Do List</h1>
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
          
          {/* Accordion Component */}
          <Accordion type="single" collapsible className="accordion">
            {task.map((task, index) => (
              <AccordionItem key={task._id} value={`task-${index}`}>
                <AccordionTrigger className="accordion-trigger">
                  {task.task}
                </AccordionTrigger>
                <AccordionContent className="accordion-content">
                  <button onClick={() => deleteTask(task._id)}>Delete</button>
                  <button onClick={() => startEditing(index)}>Edit</button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </>
  );
};

export default ToDoList;

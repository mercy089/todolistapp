import React, { useState, useEffect } from 'react';
import {
  FaTrash,
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaMoon,
  FaSun,
  FaCopy,
} from 'react-icons/fa';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('All'); // Add filter state
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtaskIndex, setSubtaskIndex] = useState(null);
  const [sortOption, setSortOption] = useState('None');

  // Local storage and time setup
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle adding a new todo
  const handleAddTodo = () => {
    if (inputValue.trim() && dueDate) {
      const newTodo = {
        text: inputValue,
        category,
        priority,
        completed: false,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString(),
        dueDate,
        subtasks: [],
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
      setEditingIndex(null);
      setDueDate('');
    }
  };

  // Handle adding a subtask
  const handleAddSubtask = (index) => {
    const newTodos = [...todos];
    if (subtaskInput.trim()) {
      newTodos[index].subtasks.push(subtaskInput.trim());
      setTodos(newTodos);
      setSubtaskInput('');
      setSubtaskIndex(null);
    }
  };

  // Handle delete, edit, and toggle complete for todos
  const handleDeleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const handleToggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const handleEditTodo = (index) => {
    setInputValue(todos[index].text);
    setCategory(todos[index].category);
    setPriority(todos[index].priority);
    setDueDate(todos[index].dueDate);
    setEditingIndex(index);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const newTodos = [...todos];
      newTodos[editingIndex].text = inputValue;
      newTodos[editingIndex].dueDate = dueDate;
      setTodos(newTodos);
      setInputValue('');
      setEditingIndex(null);
    }
  };

  // Handle clearing completed tasks
  const handleClearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // Handle duplicating a task
  const handleDuplicateTodo = (index) => {
    const duplicatedTodo = { ...todos[index], subtasks: [...todos[index].subtasks] };
    setTodos([...todos, duplicatedTodo]);
  };

  // Task Sorting
  const handleSortChange = (option) => {
    setSortOption(option);
    if (option === 'Due Date') {
      const sortedTodos = [...todos].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTodos(sortedTodos);
    } else if (option === 'Priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      const sortedTodos = [...todos].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
      setTodos(sortedTodos);
    }
  };

  // Filtering logic
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'Completed') return todo.completed;
    if (filter === 'Pending') return !todo.completed;
    if (filter === 'All') return true; // Show all todos
    return todo.category === filter && todo.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const progress = (completedCount / todos.length) * 100 || 0;

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`${
        darkMode ? 'dark' : ''
      } min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900`}
    >
      <div className='w-full max-w-4xl p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition duration-300'>
      <div className='flex flex-row justify-between items-center gap-10 '>
  {/* Real-time Clock */}
  <div className="text-center text-gray-500 dark:text-gray-400 mb-20">
   {time}
  </div>

  {/* Title */}
  <h1 className="text-[34px] font-bold text-center text-gray-700 dark:text-gray-200 ">
    Advanced Todo List
  </h1>

  {/* Dark Mode Toggle */}
  <button
    onClick={toggleDarkMode}
    className="p-2 mb-20 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-full"
  >
    {darkMode ? <FaSun /> : <FaMoon />}
  </button>
</div>


        {/* Task Input */}
        <div className="flex flex-col mb-4 space-x-2 gap-3 border p-5">
        <h1 className="text-xl font-bold text-left text-gray-700 dark:text-gray-200 ">
    Add Task</h1>
          <div className='flex justify-center items-center gap-5'>
            <input
              type="text"
              className="flex-grow p-2 w-[80%] h-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a new task..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-[25%] h-[70px] flex flex-col justify-center'>
            <label className='dark:text-white' htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              className="p-2 rounded-xl w-[100%] h-10 border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            </div>
            <div className='w-[25%] h-[70px] flex flex-col justify-center'>
            <label className='dark:text-white' htmlFor="category">Category</label>
            <select
              className="p-2 rounded-xl w-[100%] h-10 border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Urgent">Urgent</option>
            </select>
            </div>
            <div className='w-[25%] h-[70px] flex flex-col justify-center'>
            <label className='dark:text-white' htmlFor="priority">Priority</label>
            <select
              className="p-2 rounded-xl w-[100%] h-10 border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            </div>
            <div className='w-[25%] h-[70px] flex flex-col justify-center pt-6'>
            {editingIndex === null ? (
              <button
                onClick={handleAddTodo}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Add
              </button>
            ) : (
              <button
                onClick={handleSaveEdit}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
              >
                Save
              </button>
            )}
            </div>
          </div>
        </div>

        <div className='border p-5'>
        {/* Search Bar, Sort and Filter */}
        <div className="flex mb-4 space-x-2 justify-center items-center">
          <input
            type="text"
            className="flex-grow w-[60%] h-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="p-2 w-[20%] h-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="None">Sort by</option>
            <option value="Due Date">Due Date</option>
            <option value="Priority">Priority</option>
          </select>
          <select
            className="p-2 w-[20%] h-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {filteredTodos.map((todo, index) => (
            <li
              key={index}
              className={`p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-sm flex justify-between items-center transition duration-300 ${
                todo.completed ? 'opacity-50 line-through' : ''
              }`}
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {todo.text}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {todo.category} • {todo.priority} • Due: {todo.dueDate}
                </p>
                {/* Subtasks */}
                {todo.subtasks.length > 0 && (
                  <ul className="mt-2 ml-4 list-disc text-gray-600 dark:text-gray-400">
                    {todo.subtasks.map((subtask, subIndex) => (
                      <li key={subIndex}>{subtask}</li>
                    ))}
                  </ul>
                )}
                {subtaskIndex === index && (
                  <div className="mt-2 flex">
                    <input
                      type="text"
                      className="p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a subtask..."
                      value={subtaskInput}
                      onChange={(e) => setSubtaskInput(e.target.value)}
                    />
                    <button
                      onClick={() => handleAddSubtask(index)}
                      className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-300"
                    >
                      Add Subtask
                    </button>
                  </div>
                )}
              
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleComplete(index)}
                  className="text-green-500 hover:text-green-600 transition duration-300"
                >
                  <FaCheckCircle />
                </button>
                <button
                  onClick={() => setSubtaskIndex(subtaskIndex === index ? null : index)}
                  className="text-blue-500 hover:text-blue-600 transition duration-300"
                >
                  <FaPlus />
                </button>
                <button
                  onClick={() => handleEditTodo(index)}
                  className="text-yellow-500 hover:text-yellow-600 transition duration-300"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteTodo(index)}
                  className="text-red-500 hover:text-red-600 transition duration-300"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handleDuplicateTodo(index)}
                  className="text-gray-500 hover:text-gray-600 transition duration-300"
                >
                  <FaCopy />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Task progress and footer */}
        <div className="mt-6 text-gray-600 dark:text-gray-400">
          <p className='dark:text-white'>{completedCount} completed out of {todos.length} tasks</p>
          <div className="relative w-full h-4  bg-gray-300 dark:bg-gray-300 rounded-full mt-2">
            <div
              className="absolute top-0 left-0 h-4 bg-green-500 rounded-full transition-width duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={handleClearCompleted}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Clear Completed
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;

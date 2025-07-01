import React, { useState } from "react";

function ToDoList() {
  const [tasks, setTasks] = useState(["play", "wash", "sleep", "study"]);
  const [newTask, setNewTask] = useState("");

  function handleInput(event) {
    setNewTask(event.target.value);
  }

  function AddTask() {
    if (newTask.trim() !== "") {
      setTasks((prev) => [...prev, newTask]); // Fixed: should update tasks, not newTask
      setNewTask("");
    }
  }

  function DeleteTask(index) {
    const newupdate = tasks.filter((_, i) => i !== index); // Fixed syntax
    setTasks(newupdate);
  }

  function MoveUp(index) {
    if (index > 0) {
      const newupdate = [...tasks];
      [newupdate[index], newupdate[index - 1]] = [newupdate[index - 1], newupdate[index]];
      setTasks(newupdate);
    }
  }

  function MoveDown(index) {
    if (index < tasks.length - 1) {
      const newupdate = [...tasks];
      [newupdate[index], newupdate[index + 1]] = [newupdate[index + 1], newupdate[index]];
      setTasks(newupdate);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">To Do List</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter task"
          value={newTask}
          onChange={handleInput}
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={AddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <ol className="space-y-3 w-full max-w-md">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-white p-3 rounded-md shadow"
          >
            <span className="text-gray-800">{task}</span>
            <div className="flex gap-2">
              <button
                onClick={() => DeleteTask(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => MoveUp(index)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Up
              </button>
              <button
                onClick={() => MoveDown(index)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Down
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoList;
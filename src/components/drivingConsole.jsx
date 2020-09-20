import React, { useState } from "react";
import { db } from "../firebase";

function Todo({ todo, index }) {
  return <div className="todo">{todo.test}</div>;
}

function DrivingConsole() {
  const [todos, setTodos] = useState([
    {
      test: "learn react",
      isCompleted: "false",
    },
    {
      test: "learn react",
      isCompleted: false,
    },
    {
      test: "learn react",
      isCompleted: false,
    },
    {
      test: "learn react",
      isCompleted: false,
    },
    {
      test: "learn react",
      isCompleted: false,
    },
  ]);

  return (
    <div class="todo-list">
      {todos.map((todo, index) => (
        <Todo key={index} index={index} todo={todo} />
      ))}
      <h1>sss</h1>
    </div>
  );
}

export default DrivingConsole;

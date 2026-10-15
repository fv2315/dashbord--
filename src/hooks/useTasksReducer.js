
import { useReducer } from "react";

function tasksReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return [action.payload, ...state];

    case "REMOVE_TASK":
      return state.filter(
        (task) => task.id !== action.payload
      );

    case "TOGGLE_TASK":
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );

    case "UPDATE_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.changes }
          : task
      );

    case "CLEAR_COMPLETED":
      return state.filter((task) => !task.completed);

    case "LOAD_TASKS":
      return Array.isArray(action.payload)
        ? action.payload
        : state;

    default:
      return state;
  }
}

export default function useTasksReducer(initialTasks = []) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return { tasks, dispatch };
}

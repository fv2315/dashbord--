
import { memo } from "react";

function TaskList({ tasks, onToggleTask, onRemoveTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">▤</div>
        <h3>No hay tareas para mostrar</h3>
        <p>Agrega una tarea o modifica los filtros de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article className="task-item" key={task.id}>
          <button
            type="button"
            className={`check-button ${
              task.completed ? "checked" : ""
            }`}
            aria-label={
              task.completed
                ? `Marcar ${task.title} como pendiente`
                : `Completar ${task.title}`
            }
            onClick={() => onToggleTask(task.id)}
          >
            {task.completed ? "✓" : ""}
          </button>

          <div className="task-details">
            <h3
              className={
                task.completed ? "completed-title" : ""
              }
            >
              {task.title}
            </h3>

            <div className="task-meta">
              <span className={`priority ${task.priority}`}>
                {task.priority}
              </span>

              {task.dueDate && (
                <span>Fecha límite: {task.dueDate}</span>
              )}
            </div>
          </div>

          <span
            className={`status ${
              task.completed ? "done" : "pending"
            }`}
          >
            {task.completed ? "Completada" : "Pendiente"}
          </span>

          <button
            type="button"
            className="delete-button"
            aria-label={`Eliminar ${task.title}`}
            onClick={() => onRemoveTask(task.id)}
          >
            Eliminar
          </button>
        </article>
      ))}
    </div>
  );
}

export default memo(TaskList);


import { memo, useRef, useState } from "react";

function TaskForm({ onAddTask }) {
  const inputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("media");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      inputRef.current?.focus();
      return;
    }

    onAddTask({
      id: crypto.randomUUID(),
      title: cleanTitle,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    });

    setTitle("");
    setPriority("media");
    setDueDate("");
    inputRef.current?.focus();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-field title-field">
        <label htmlFor="task-title">Nombre de la tarea</label>
        <input
          ref={inputRef}
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ej. Terminar el informe"
          maxLength={120}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-priority">Prioridad</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="task-date">Fecha límite</label>
        <input
          id="task-date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      <button className="primary-button add-button" type="submit">
        + Agregar tarea
      </button>
    </form>
  );
}

export default memo(TaskForm);

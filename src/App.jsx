
import {
  memo,
  Profiler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import useTasksReducer from "./hooks/useTasksReducer";
import useLocalStorage from "./hooks/useLocalStorage";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import DashboardStats from "./components/DashboardStats";

function DashboardContent() {
  const { theme, toggleTheme } = useTheme();

  const [savedTasks, setSavedTasks] = useLocalStorage(
    "dashboard-tasks",
    []
  );

  const { tasks, dispatch } = useTasksReducer(savedTasks);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");
  const [sort, setSort] = useState("recientes");
  const [showCompleted, setShowCompleted] = useState(true);
  const [notice, setNotice] = useState("");

  // Restaurar las tareas guardadas al iniciar el dashboard.
  useEffect(() => {
    dispatch({ type: "LOAD_TASKS", payload: savedTasks });
  }, []); // Solo se necesita la carga inicial.

  // Sincronizar las tareas con el almacenamiento.
  useEffect(() => {
    setSavedTasks(tasks);
  }, [tasks, setSavedTasks]);

  // Ejemplo de efecto con suscripción y cleanup real.
  useEffect(() => {
    const handleOnline = () => setNotice("Conexión restablecida");
    const handleOffline = () => setNotice("Sin conexión a Internet");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleAddTask = useCallback((task) => {
    dispatch({ type: "ADD_TASK", payload: task });
    setNotice("Tarea agregada correctamente");
  }, [dispatch]);

  const handleRemoveTask = useCallback((id) => {
    dispatch({ type: "REMOVE_TASK", payload: id });
    setNotice("Tarea eliminada");
  }, [dispatch]);

  const handleToggleTask = useCallback((id) => {
    dispatch({ type: "TOGGLE_TASK", payload: id });
  }, [dispatch]);

  const handleClearCompleted = useCallback(() => {
    dispatch({ type: "CLEAR_COMPLETED" });
    setNotice("Tareas completadas eliminadas");
  }, [dispatch]);

  // Calcular estadísticas a partir del estado actual.
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;

    return {
      total,
      completed,
      pending,
      progress: total
        ? Math.round((completed / total) * 100)
        : 0,
    };
  }, [tasks]);

  // Filtrar y ordenar sin repetir el cálculo en cada render.
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(query);

      const matchesFilter =
        filter === "todas" ||
        (filter === "pendientes" && !task.completed) ||
        (filter === "completadas" && task.completed) ||
        (filter === "alta" && task.priority === "alta");

      const matchesCompleted = showCompleted || !task.completed;

      return matchesSearch && matchesFilter && matchesCompleted;
    });

    return [...result].sort((a, b) => {
      if (sort === "alfabetico") {
        return a.title.localeCompare(b.title);
      }

      if (sort === "prioridad") {
        const weight = { alta: 3, media: 2, baja: 1 };
        return weight[b.priority] - weight[a.priority];
      }

      if (sort === "fecha") {
        return (a.dueDate || "9999-12-31").localeCompare(
          b.dueDate || "9999-12-31"
        );
      }

      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [tasks, search, filter, sort, showCompleted]);

  const handleProfilerRender = useCallback(
    (id, phase, actualDuration, baseDuration) => {
      console.log("React Profiler:", {
        id,
        phase,
        actualDuration,
        baseDuration,
      });
    },
    []
  );

  return (
    <Profiler id="Dashboard" onRender={handleProfilerRender}>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-logo">D</div>
            <div>
              <strong>TaskFlow</strong>
              <small>Gestión inteligente</small>
            </div>
          </div>

          <p className="menu-label">MENÚ PRINCIPAL</p>

          <div className="side-link active">▦ &nbsp; Dashboard</div>
          <div className="side-link">☑ &nbsp; Mis tareas</div>
          <div className="side-link">◷ &nbsp; Actividad</div>

          <div className="sidebar-bottom">
            <div className="profile-avatar">ES</div>
            <div className="profile-info">
              <strong>Estudiante</strong>
              <small>Administrador</small>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <span className="breadcrumb">Workspace / Dashboard</span>
              <h1>Dashboard de gestión</h1>
              <p>Organiza tus actividades y mide tu progreso.</p>
            </div>

            <button
              className="theme-button"
              onClick={toggleTheme}
              type="button"
            >
              {theme === "light" ? "☾ Modo oscuro" : "☀ Modo claro"}
            </button>
          </header>

          {notice && (
            <div className="notice" role="status">
              {notice}
              <button
                type="button"
                aria-label="Cerrar notificación"
                onClick={() => setNotice("")}
              >
                ×
              </button>
            </div>
          )}

          <DashboardStats stats={stats} />

          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Crear nueva tarea</h2>
                <p>Registra las actividades que necesitas completar.</p>
              </div>
            </div>

            <TaskForm onAddTask={handleAddTask} />
          </section>

          <section className="panel tasks-panel">
            <div className="section-heading">
              <div>
                <h2>Mis tareas</h2>
                <p>
                  Mostrando {filteredTasks.length} de {tasks.length} tareas.
                </p>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={handleClearCompleted}
                disabled={stats.completed === 0}
              >
                Limpiar completadas
              </button>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <span>⌕</span>
                <input
                  aria-label="Buscar tareas"
                  placeholder="Buscar tarea..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <select
                aria-label="Filtrar tareas"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="todas">Todas</option>
                <option value="pendientes">Pendientes</option>
                <option value="completadas">Completadas</option>
                <option value="alta">Prioridad alta</option>
              </select>

              <select
                aria-label="Ordenar tareas"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="alfabetico">Orden alfabético</option>
                <option value="prioridad">Por prioridad</option>
                <option value="fecha">Por fecha límite</option>
              </select>
            </div>

            <label className="completed-toggle">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(event) => setShowCompleted(event.target.checked)}
              />
              Mostrar tareas completadas
            </label>

            <TaskList
              tasks={filteredTasks}
              onToggleTask={handleToggleTask}
              onRemoveTask={handleRemoveTask}
            />
          </section>

          <footer className="footer">
            Dashboard de Gestión · React Hooks · Práctica académica
          </footer>
        </main>
      </div>
    </Profiler>
  );
}

const Dashboard = memo(DashboardContent);

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

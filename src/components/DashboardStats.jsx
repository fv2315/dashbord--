
import { memo } from "react";

function DashboardStats({ stats }) {
  const cards = [
    {
      label: "Total de tareas",
      value: stats.total,
      icon: "▤",
      color: "blue",
    },
    {
      label: "Pendientes",
      value: stats.pending,
      icon: "◷",
      color: "orange",
    },
    {
      label: "Completadas",
      value: stats.completed,
      icon: "✓",
      color: "green",
    },
    {
      label: "Progreso",
      value: `${stats.progress}%`,
      icon: "↗",
      color: "purple",
    },
  ];

  return (
    <section className="stats-grid" aria-label="Estadísticas">
      {cards.map((card) => (
        <article className="stat-card" key={card.label}>
          <div className={`stat-icon ${card.color}`}>
            {card.icon}
          </div>
          <div>
            <p>{card.label}</p>
            <h2>{card.value}</h2>
          </div>
        </article>
      ))}
    </section>
  );
}

export default memo(DashboardStats);

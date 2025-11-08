import { FormEvent, useState } from 'react';

import { TaskStatus } from '../types/task.js';

interface TaskFiltersProps {
  onFilter: (filters: { status?: TaskStatus; q?: string }) => void;
}

export const TaskFilters = ({ onFilter }: TaskFiltersProps) => {
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [search, setSearch] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onFilter({ status: status || undefined, q: search || undefined });
  };

  const handleReset = () => {
    setStatus('');
    setSearch('');
    onFilter({});
  };

  return (
    <form className="task-filters" onSubmit={handleSubmit}>
      <label>
        Estado
        <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus | '')}>
          <option value="">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En progreso</option>
          <option value="done">Finalizada</option>
        </select>
      </label>
      <label>
        Buscar
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Título o descripción" />
      </label>
      <div className="actions">
        <button type="submit">Aplicar</button>
        <button type="button" onClick={handleReset}>
          Limpiar
        </button>
      </div>
    </form>
  );
};

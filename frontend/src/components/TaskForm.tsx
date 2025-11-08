import { FormEvent, useState } from 'react';

import { TaskStatus } from '../types/task.js';

interface TaskFormProps {
  onSubmit: (payload: { title: string; description?: string; status?: TaskStatus }) => Promise<void> | void;
  isSubmitting: boolean;
}

export const TaskForm = ({ onSubmit, isSubmitting }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      status
    };

    try {
      await onSubmit(payload);
      setTitle('');
      setDescription('');
      setStatus('pending');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'No se pudo crear la tarea');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Crear nueva tarea</h2>
      <label>
        Título
        <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required disabled={isSubmitting} />
      </label>
      <label>
        Descripción
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={2000}
          disabled={isSubmitting}
        />
      </label>
      <label>
        Estado inicial
        <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)} disabled={isSubmitting}>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En progreso</option>
          <option value="done">Finalizada</option>
        </select>
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Crear tarea'}
      </button>
    </form>
  );
};

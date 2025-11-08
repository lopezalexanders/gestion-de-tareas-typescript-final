import { Task, TaskStatus } from '../types/task.js';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  isUpdating: boolean;
}

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  done: 'Finalizada'
};

export const TaskList = ({ tasks, onStatusChange, isUpdating }: TaskListProps) => {
  if (!tasks.length) {
    return <p>No hay tareas registradas.</p>;
  }

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Actualizado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>{task.title}</td>
            <td>{task.description ?? '-'}</td>
            <td>{statusLabels[task.status]}</td>
            <td>{new Date(task.updated_at).toLocaleString()}</td>
            <td>
              <select
                value={task.status}
                onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
                disabled={isUpdating}
              >
                <option value="pending" disabled={task.status !== 'pending'}>
                  Pendiente
                </option>
                <option value="in_progress" disabled={task.status === 'done'}>
                  En progreso
                </option>
                <option value="done">Finalizada</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

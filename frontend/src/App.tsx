import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useTasks } from './hooks/useTasks.js';
import { TaskForm } from './components/TaskForm.js';
import { TaskList } from './components/TaskList.js';
import { TaskFilters } from './components/TaskFilters.js';
import { TaskStatus } from './types/task.js';

const queryClient = new QueryClient();

const Dashboard = () => {
  const [filters, setFilters] = useState<{ status?: TaskStatus; q?: string }>({});
  const { tasksQuery, createTaskMutation, updateStatusMutation } = useTasks(filters);

  const handleCreateTask = async (payload: { title: string; description?: string; status?: TaskStatus }) => {
    await createTaskMutation.mutateAsync(payload);
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await updateStatusMutation.mutateAsync({ id, status });
  };

  return (
    <div className="layout">
      <header>
        <h1>DevPro Tasks</h1>
        <p>Gestiona tareas pendientes, en progreso y completadas.</p>
      </header>
      <main>
        <section className="side-panel">
          <TaskForm onSubmit={handleCreateTask} isSubmitting={createTaskMutation.isPending} />
        </section>
        <section className="content">
          <TaskFilters onFilter={setFilters} />
          {tasksQuery.isLoading ? (
            <p>Cargando tareas...</p>
          ) : tasksQuery.isError ? (
            <p>Ocurrió un error al cargar las tareas.</p>
          ) : (
            <TaskList
              tasks={tasksQuery.data?.items ?? []}
              onStatusChange={handleStatusChange}
              isUpdating={updateStatusMutation.isPending}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <Dashboard />
  </QueryClientProvider>
);

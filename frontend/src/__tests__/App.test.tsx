import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TaskList } from '../components/TaskList.js';
import { TaskForm } from '../components/TaskForm.js';

describe('Task components', () => {
  it('renders empty task list message', () => {
    render(<TaskList tasks={[]} onStatusChange={vi.fn()} isUpdating={false} />);
    expect(screen.getByText(/No hay tareas/)).toBeInTheDocument();
  });

  it('submits form when title is provided', async () => {
    const onSubmit = vi.fn();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <TaskForm onSubmit={onSubmit} isSubmitting={false} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Nueva tarea' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear tarea/i }));

    expect(onSubmit).toHaveBeenCalled();
  });
});

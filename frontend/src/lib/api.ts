import { PaginatedTasks, Task, TaskStatus } from '../types/task.js';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message ?? 'Unexpected error');
  }
  return response.json() as Promise<T>;
};

export const fetchTasks = async (params: { status?: TaskStatus; q?: string; limit?: number; offset?: number } = {}): Promise<PaginatedTasks> => {
  const searchParams = new URLSearchParams();
  if (params.status) {
    searchParams.set('status', params.status);
  }
  if (params.q) {
    searchParams.set('q', params.q);
  }
  if (params.limit) {
    searchParams.set('limit', String(params.limit));
  }
  if (params.offset) {
    searchParams.set('offset', String(params.offset));
  }

  const url = `${BASE_URL}/tasks${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetch(url);
  return handleResponse<PaginatedTasks>(response);
};

export const createTask = async (payload: { title: string; description?: string; status?: TaskStatus }): Promise<Task> => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse<Task>(response);
};

export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
  const response = await fetch(`${BASE_URL}/tasks/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return handleResponse<Task>(response);
};

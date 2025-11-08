export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface PaginatedTasks {
  items: Task[];
  total: number;
}

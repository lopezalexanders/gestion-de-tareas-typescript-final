import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTask, fetchTasks, updateTaskStatus } from '../lib/api.js';
import { TaskStatus } from '../types/task.js';

export const useTasks = (filters: { status?: TaskStatus; q?: string }) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => fetchTasks(filters),
    staleTime: 5 * 1000
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: invalidate
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => updateTaskStatus(id, status),
    onSuccess: invalidate
  });

  return {
    tasksQuery,
    createTaskMutation,
    updateStatusMutation
  };
};

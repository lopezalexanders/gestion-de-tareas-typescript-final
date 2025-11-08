import { z } from 'zod';

export const TaskStatusSchema = z.enum(['pending', 'in_progress', 'done']);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const CreateTaskSchema = z
  .object({
    title: z.string().min(1).max(120),
    description: z
      .string()
      .max(2000)
      .optional()
      .or(z.literal(''))
      .transform((value) => (value === '' ? undefined : value)),
    status: TaskStatusSchema.optional()
  })
  .strict();

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskStatusSchema = z
  .object({
    status: TaskStatusSchema
  })
  .strict();

export type UpdateTaskStatusInput = z.infer<typeof UpdateTaskStatusSchema>;

export const ListTasksQuerySchema = z
  .object({
    status: TaskStatusSchema.optional(),
    q: z.string().optional(),
    limit: z
      .string()
      .transform((value) => Number(value))
      .optional()
      .refine((value) => value === undefined || (Number.isInteger(value) && value >= 1 && value <= 100), {
        message: 'limit must be between 1 and 100'
      }),
    offset: z
      .string()
      .transform((value) => Number(value))
      .optional()
      .refine((value) => value === undefined || (Number.isInteger(value) && value >= 0), {
        message: 'offset must be a non-negative integer'
      })
  })
  .partial()
  .strict();

export type ListTasksQueryInput = z.infer<typeof ListTasksQuerySchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(120),
  description: z.string().max(2000).nullable(),
  status: TaskStatusSchema,
  created_at: z.string(),
  updated_at: z.string()
});

export type Task = z.infer<typeof TaskSchema>;

export const isTransitionAllowed = (current: TaskStatus, next: TaskStatus): boolean => {
  if (current === 'pending') {
    return next === 'in_progress' || next === 'done';
  }
  if (current === 'in_progress') {
    return next === 'done';
  }
  if (current === 'done') {
    return next === 'done';
  }
  return false;
};

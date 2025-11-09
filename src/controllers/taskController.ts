import { Request, Response } from "express";
import { tasks } from "../data/tasks";
import { Task, TaskStatus } from "../models/task";
import { isValidTitle, isValidDescription, isValidStatus } from "../utils/validateTask";
import { canTransition } from "../utils/statusTransitions";
import { v4 as uuidv4 } from "uuid";

// Create Task (POST /tasks)
export function createTask(req: Request, res: Response) {
  const { title, description, status } = req.body;

  // Validations
  if (!isValidTitle(title)) {
    return res.status(400).json({ error: "Title is required and must be 1-120 chars." });
  }
  if (!isValidDescription(description)) {
    return res.status(400).json({ error: "Description must be <= 2000 chars." });
  }
  let taskStatus: TaskStatus = "pending";
  if (status !== undefined) {
    if (!isValidStatus(status)) {
      return res
        .status(400)
        .json({ error: `Status must be one of: pending, in_progress, done.` });
    }
    taskStatus = status;
  }
  const now = new Date().toISOString();
  const newTask: Task = {
    id: uuidv4(),
    title: title.trim(),
    description,
    status: taskStatus,
    created_at: now,
    updated_at: now,
  };
  tasks.push(newTask);
  return res.status(201).json(newTask);
}

// List Tasks (GET /tasks)
export function listTasks(_req: Request, res: Response) {
  const sorted = [...tasks].sort((a, b) => b.created_at.localeCompare(a.created_at));
  return res.json(sorted);
}

// Update Task Status (PATCH /tasks/:id)
export function updateTaskStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found." });

  if (!isValidStatus(status)) {
    return res.status(400).json({ error: `Status must be one of: pending, in_progress, done.` });
  }
  if (task.status === status) {
    return res.status(200).json(task); // idempotent
  }
  if (!canTransition(task.status, status)) {
    return res.status(400).json({
      error: `Invalid status transition: ${task.status} -> ${status}`,
    });
  }

  task.status = status;
  task.updated_at = new Date().toISOString();
  return res.json(task);
}
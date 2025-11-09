import { TaskStatus } from "../models/task";

export function canTransition(current: TaskStatus, next: TaskStatus): boolean {
  if (current === "pending") {
    return next === "in_progress" || next === "done";
  }
  if (current === "in_progress") {
    return next === "done";
  }
  // No allowed transitions from DONE in MVP
  return false;
}
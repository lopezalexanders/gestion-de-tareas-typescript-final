import { TaskStatus } from "../models/task";

export function isValidTitle(title: unknown): title is string {
  return typeof title === "string" && title.trim().length > 0 && title.length <= 120;
}

export function isValidDescription(description: unknown): boolean {
  return (
    description === undefined ||
    (typeof description === "string" && description.length <= 2000)
  );
}

export function isValidStatus(status: unknown): status is TaskStatus {
  return status === "pending" || status === "in_progress" || status === "done";
}
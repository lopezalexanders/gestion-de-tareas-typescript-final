"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
exports.listTasks = listTasks;
exports.updateTaskStatus = updateTaskStatus;
const tasks_1 = require("../data/tasks");
const validateTask_1 = require("../utils/validateTask");
const statusTransitions_1 = require("../utils/statusTransitions");
const uuid_1 = require("uuid");
// Create Task (POST /tasks)
function createTask(req, res) {
    const { title, description, status } = req.body;
    // Validations
    if (!(0, validateTask_1.isValidTitle)(title)) {
        return res.status(400).json({ error: "Title is required and must be 1-120 chars." });
    }
    if (!(0, validateTask_1.isValidDescription)(description)) {
        return res.status(400).json({ error: "Description must be <= 2000 chars." });
    }
    let taskStatus = "pending";
    if (status !== undefined) {
        if (!(0, validateTask_1.isValidStatus)(status)) {
            return res
                .status(400)
                .json({ error: `Status must be one of: pending, in_progress, done.` });
        }
        taskStatus = status;
    }
    const now = new Date().toISOString();
    const newTask = {
        id: (0, uuid_1.v4)(),
        title: title.trim(),
        description,
        status: taskStatus,
        created_at: now,
        updated_at: now,
    };
    tasks_1.tasks.push(newTask);
    return res.status(201).json(newTask);
}
// List Tasks (GET /tasks)
function listTasks(_req, res) {
    const sorted = [...tasks_1.tasks].sort((a, b) => b.created_at.localeCompare(a.created_at));
    return res.json(sorted);
}
// Update Task Status (PATCH /tasks/:id)
function updateTaskStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const task = tasks_1.tasks.find((t) => t.id === id);
    if (!task)
        return res.status(404).json({ error: "Task not found." });
    if (!(0, validateTask_1.isValidStatus)(status)) {
        return res.status(400).json({ error: `Status must be one of: pending, in_progress, done.` });
    }
    if (task.status === status) {
        return res.status(200).json(task); // idempotent
    }
    if (!(0, statusTransitions_1.canTransition)(task.status, status)) {
        return res.status(400).json({
            error: `Invalid status transition: ${task.status} -> ${status}`,
        });
    }
    task.status = status;
    task.updated_at = new Date().toISOString();
    return res.json(task);
}

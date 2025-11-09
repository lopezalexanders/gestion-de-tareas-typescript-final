"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
router.post("/tasks", taskController_1.createTask);
router.get("/tasks", taskController_1.listTasks);
router.patch("/tasks/:id", taskController_1.updateTaskStatus);
exports.default = router;

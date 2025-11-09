import { Router } from "express";
import {
  createTask,
  listTasks,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

router.post("/tasks", createTask);
router.get("/tasks", listTasks);
router.patch("/tasks/:id", updateTaskStatus);

export default router;
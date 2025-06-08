import { Request, Response } from "express";
import { TaskService } from "@application/usecases/TaskService";

const taskService = new TaskService();

export async function listTasks(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const tasks = await taskService.listTasks(userId);
  res.json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const { id } = req.params;
  const task = await taskService.getTask(id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
}

export async function createTask(req: Request, res: Response) {
  const task = await taskService.createTask(req.body);
  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  const updated = await taskService.updateTask(id, req.body);
  if (!updated) return res.status(404).json({ message: "Task not found" });
  res.json(updated);
}

export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params;
  await taskService.deleteTask(id);
  res.status(204).send();
}

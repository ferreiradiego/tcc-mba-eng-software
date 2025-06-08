import { Request, Response } from "express";
import { PrismaTaskRepository } from "@infrastructure/repositories/PrismaTaskRepository";

const taskRepo = new PrismaTaskRepository();

export async function listTasks(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const tasks = await taskRepo.findAll(userId);
  res.json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const { id } = req.params;
  const task = await taskRepo.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
}

export async function createTask(req: Request, res: Response) {
  const task = await taskRepo.create(req.body);
  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  const updated = await taskRepo.update(id, req.body);
  if (!updated) return res.status(404).json({ message: "Task not found" });
  res.json(updated);
}

export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params;
  await taskRepo.delete(id);
  res.status(204).send();
}

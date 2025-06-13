import { SprintService } from "@application/usecases/scrum/SprintService";
import { PrismaSprintRepository } from "@infrastructure/repositories/scrum/PrismaSprintRepository";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const repo = new PrismaSprintRepository(prisma);
const service = new SprintService(repo);

export const createSprint = async (req: Request, res: Response) => {
  try {
    const sprint = await service.create(req.body);
    res.status(201).json(sprint);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
};

export const getSprints = async (_: Request, res: Response) => {
  const sprints = await service.getAll();
  res.json(sprints);
};

export const getSprintById = async (req: Request, res: Response) => {
  const sprint = await service.getById(req.params.id);
  if (!sprint) return res.status(404).json({ error: "Not found" });
  res.json(sprint);
};

export const updateSprint = async (req: Request, res: Response) => {
  try {
    const sprint = await service.update(req.params.id, req.body);
    res.json(sprint);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
};

export const deleteSprint = async (req: Request, res: Response) => {
  await service.delete(req.params.id);
  res.status(204).send();
};

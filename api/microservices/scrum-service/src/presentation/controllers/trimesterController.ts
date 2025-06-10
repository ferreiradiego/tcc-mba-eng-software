import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { TrimesterService } from "../../application/usecases/TrimesterService";
import { PrismaTrimesterRepository } from "../../infrastructure/repositories/PrismaTrimesterRepository";

const prisma = new PrismaClient();
const repo = new PrismaTrimesterRepository(prisma);
const service = new TrimesterService(repo);

export const createTrimester = async (req: Request, res: Response) => {
  try {
    const { year, number } = req.body;
    const trimester = await service.create({ year, number });
    res.status(201).json(trimester);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
};

export const getTrimesters = async (_: Request, res: Response) => {
  const trimesters = await service.getAll();
  res.json(trimesters);
};

export const getTrimesterById = async (req: Request, res: Response) => {
  const trimester = await service.getById(req.params.id);
  if (!trimester) return res.status(404).json({ error: "Not found" });
  res.json(trimester);
};

export const updateTrimester = async (req: Request, res: Response) => {
  try {
    const { year, number } = req.body;
    const trimester = await service.update(req.params.id, { year, number });
    res.json(trimester);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
};

export const deleteTrimester = async (req: Request, res: Response) => {
  await service.delete(req.params.id);
  res.status(204).send();
};

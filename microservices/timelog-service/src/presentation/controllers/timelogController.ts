import { Request, Response } from 'express';
import { PrismaTimeLogRepository } from '@infrastructure/repositories/PrismaTimeLogRepository';

const timelogRepo = new PrismaTimeLogRepository();

export async function listTimeLogs(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const timelogs = await timelogRepo.findAll(userId);
  res.json(timelogs);
}

export async function getTimeLog(req: Request, res: Response) {
  const { id } = req.params;
  const timelog = await timelogRepo.findById(id);
  if (!timelog) return res.status(404).json({ message: 'TimeLog not found' });
  res.json(timelog);
}

export async function createTimeLog(req: Request, res: Response) {
  const timelog = await timelogRepo.create(req.body);
  res.status(201).json(timelog);
}

export async function updateTimeLog(req: Request, res: Response) {
  const { id } = req.params;
  const updated = await timelogRepo.update(id, req.body);
  if (!updated) return res.status(404).json({ message: 'TimeLog not found' });
  res.json(updated);
}

export async function deleteTimeLog(req: Request, res: Response) {
  const { id } = req.params;
  await timelogRepo.delete(id);
  res.status(204).send();
}

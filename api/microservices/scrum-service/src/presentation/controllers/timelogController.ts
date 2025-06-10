import { TimeLogService } from "@application/usecases/TimeLogService";
import { Request, Response } from "express";

const timeLogService = new TimeLogService();

export async function listTimeLogs(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const timelogs = await timeLogService.listTimeLogs(userId);
  res.json(timelogs);
}

export async function getTimeLog(req: Request, res: Response) {
  const { id } = req.params;
  const timelog = await timeLogService.getTimeLog(id);
  if (!timelog) return res.status(404).json({ message: "TimeLog not found" });
  res.json(timelog);
}

export async function createTimeLog(req: Request, res: Response) {
  const timelog = await timeLogService.createTimeLog(req.body);
  res.status(201).json(timelog);
}

export async function updateTimeLog(req: Request, res: Response) {
  const { id } = req.params;
  const updated = await timeLogService.updateTimeLog(id, req.body);
  if (!updated) return res.status(404).json({ message: "TimeLog not found" });
  res.json(updated);
}

export async function deleteTimeLog(req: Request, res: Response) {
  const { id } = req.params;
  await timeLogService.deleteTimeLog(id);
  res.status(204).send();
}

import { Request, Response } from "express";
import { CeremonyService } from "@application/usecases/CeremonyService";

const ceremonyService = new CeremonyService();

export async function listCeremonies(req: Request, res: Response) {
  const ceremonies = await ceremonyService.listCeremonies();
  res.json(ceremonies);
}

export async function getCeremony(req: Request, res: Response) {
  const { id } = req.params;
  const ceremony = await ceremonyService.getCeremony(id);
  if (!ceremony) return res.status(404).json({ message: "Ceremony not found" });
  res.json(ceremony);
}

export async function createCeremony(req: Request, res: Response) {
  const ceremony = await ceremonyService.createCeremony(req.body);
  res.status(201).json(ceremony);
}

export async function updateCeremony(req: Request, res: Response) {
  const { id } = req.params;
  const updated = await ceremonyService.updateCeremony(id, req.body);
  if (!updated) return res.status(404).json({ message: "Ceremony not found" });
  res.json(updated);
}

export async function deleteCeremony(req: Request, res: Response) {
  const { id } = req.params;
  await ceremonyService.deleteCeremony(id);
  res.status(204).send();
}

import { CeremonyService } from "@application/usecases/CeremonyService";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const ceremonyService = new CeremonyService();

export async function listCeremonies(req: Request, res: Response) {
  const userId = req.query.userId as string | undefined;
  const ceremonies = await ceremonyService.listCeremonies(userId);
  res.json(ceremonies);
}

export async function getCeremony(req: Request, res: Response) {
  const { id } = req.params;
  const ceremony = await ceremonyService.getCeremony(id);
  if (!ceremony) return res.status(404).json({ message: "Ceremony not found" });
  res.json(ceremony);
}

export async function createCeremony(req: Request, res: Response) {
  let userId = undefined;
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].replace("Bearer ", "");
    try {
      const decoded: any = jwt.decode(token);
      userId = decoded?.sub;
    } catch {}
  }
  const participants = userId ? [userId] : [];

  const data = {
    ...req.body,
    participants,
  };
  const ceremony = await ceremonyService.createCeremony(data);
  res.status(201).json(ceremony);
}

export async function updateCeremony(req: Request, res: Response) {
  const { id } = req.params;
  let userId = undefined;
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].replace("Bearer ", "");
    try {
      const decoded: any = jwt.decode(token);
      userId = decoded?.sub;
    } catch {}
  }

  const participants = userId ? [userId] : [];

  const data = {
    ...req.body,
    participants,
  };
  const updated = await ceremonyService.updateCeremony(id, data);
  if (!updated) return res.status(404).json({ message: "Ceremony not found" });
  res.json(updated);
}

export async function deleteCeremony(req: Request, res: Response) {
  const { id } = req.params;
  await ceremonyService.deleteCeremony(id);
  res.status(204).send();
}

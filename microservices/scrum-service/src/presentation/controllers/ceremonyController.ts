import { Request, Response } from 'express';
import { PrismaCeremonyRepository } from '@infrastructure/repositories/PrismaCeremonyRepository';

const ceremonyRepo = new PrismaCeremonyRepository();

export async function listCeremonies(req: Request, res: Response) {
  const ceremonies = await ceremonyRepo.findAll();
  res.json(ceremonies);
}

export async function getCeremony(req: Request, res: Response) {
  const { id } = req.params;
  const ceremony = await ceremonyRepo.findById(id);
  if (!ceremony) return res.status(404).json({ message: 'Ceremony not found' });
  res.json(ceremony);
}

export async function createCeremony(req: Request, res: Response) {
  const ceremony = await ceremonyRepo.create(req.body);
  res.status(201).json(ceremony);
}

export async function updateCeremony(req: Request, res: Response) {
  const { id } = req.params;
  const updated = await ceremonyRepo.update(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Ceremony not found' });
  res.json(updated);
}

export async function deleteCeremony(req: Request, res: Response) {
  const { id } = req.params;
  await ceremonyRepo.delete(id);
  res.status(204).send();
}

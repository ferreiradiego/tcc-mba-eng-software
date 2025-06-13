import { UserStoryService } from "@application/usecases/scrum/UserStoryService";
import { Request, Response } from "express";

const userStoryService = new UserStoryService();

export async function listUserStories(req: Request, res: Response) {
  const userStories = await userStoryService.listUserStories();
  res.json(userStories);
}

export async function getUserStory(req: Request, res: Response) {
  const { id } = req.params;
  const userStory = await userStoryService.getUserStory(id);
  if (!userStory)
    return res.status(404).json({ message: "User Story not found" });
  res.json(userStory);
}

export async function createUserStory(req: Request, res: Response) {
  const userStory = await userStoryService.createUserStory(req.body);
  res.status(201).json(userStory);
}

export async function updateUserStory(req: Request, res: Response) {
  const { id } = req.params;
  const updated = await userStoryService.updateUserStory(id, req.body);
  if (!updated)
    return res.status(404).json({ message: "User Story not found" });
  res.json(updated);
}

export async function deleteUserStory(req: Request, res: Response) {
  const { id } = req.params;
  await userStoryService.deleteUserStory(id);
  res.status(204).send();
}

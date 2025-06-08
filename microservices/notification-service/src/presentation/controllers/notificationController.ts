import { Request, Response } from "express";
import { NotificationService } from "@application/services/NotificationService";

const notificationService = new NotificationService();

export async function sendNotificationController(req: Request, res: Response) {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || !text) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios: to, subject, text" });
  }

  try {
    await notificationService.sendEmail(to, subject, text, html);
    res.status(200).json({ message: "Notificação enviada com sucesso" });
  } catch (err) {
    res.status(500).json({
      error: "Erro ao enviar notificação",
      details: (err as Error).message,
    });
  }
}

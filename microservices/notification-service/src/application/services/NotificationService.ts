import { sendEmailNotification } from "@application/usecases/sendEmailNotification";

export class NotificationService {
  async sendEmail(to: string, subject: string, text: string, html?: string) {
    if (!to || !subject || !text) {
      throw new Error("Campos obrigatórios: to, subject, text");
    }

    return sendEmailNotification(to, subject, text, html);
  }
}

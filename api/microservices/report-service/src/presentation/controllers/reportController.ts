import { Request, Response } from "express";
import { generatePDFReport } from "@application/usecases/pdfReport";
import { ReportTaskRepository } from "@infrastructure/repositories/ReportTaskRepository";
import { ReportCeremonyRepository } from "@infrastructure/repositories/ReportCeremonyRepository";

const taskRepo = new ReportTaskRepository();
const ceremonyRepo = new ReportCeremonyRepository();

export async function tasksReport(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const token = req.headers.authorization?.replace("Bearer ", "") || "";
  if (!userId) return res.status(400).json({ error: "userId é obrigatório" });
  const tasks = await taskRepo.findAllByUser(userId, token);
  res.json({ report: "Relatório de tarefas", data: tasks });
}

export async function ceremoniesReport(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const token = req.headers.authorization?.replace("Bearer ", "") || "";
  if (!userId) return res.status(400).json({ error: "userId é obrigatório" });
  const ceremonies = await ceremonyRepo.findAllByUser(userId, token);
  res.json({ report: "Relatório de cerimônias", data: ceremonies });
}

export async function summaryReport(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const token = req.headers.authorization?.replace("Bearer ", "") || "";
  if (!userId) return res.status(400).json({ error: "userId é obrigatório" });
  const [tasks, ceremonies] = await Promise.all([
    taskRepo.findAllByUser(userId, token),
    ceremonyRepo.findAllByUser(userId, token),
  ]);
  res.json({
    report: "Resumo geral",
    data: {
      totalTasks: tasks.length,
      totalCeremonies: ceremonies.length,
      tasks,
      ceremonies,
    },
  });
}

export async function exportReport(req: Request, res: Response) {
  const format = req.query.format || "pdf";
  const userId = req.query.userId as string;
  const type = req.query.type as string || "summary";
  const token = req.headers.authorization?.replace("Bearer ", "") || "";
  const year = req.query.year ? Number(req.query.year) : undefined;
  const number = req.query.number ? Number(req.query.number) : undefined;
  if (!userId) return res.status(400).json({ error: "userId é obrigatório" });
  if (format === "pdf") {
    try {
      const pdfBuffer = await generatePDFReport(userId, token, type, { year, number });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=relatorio-${type}.pdf`
      );
      return res.send(pdfBuffer);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Erro ao gerar PDF", details: (err as Error).message });
    }
  }
  res.status(400).json({ error: "Formato não suportado" });
}

import { ReportCeremonyRepository } from "@infrastructure/repositories/report/ReportCeremonyRepository";
import { ReportTaskRepository } from "@infrastructure/repositories/report/ReportTaskRepository";
import { ReportTrimesterRepository } from "@infrastructure/repositories/report/ReportTrimesterRepository";
import { ReportUserRepository } from "@infrastructure/repositories/report/ReportUserRepository";
import PDFDocument from "pdfkit";

const taskRepo = new ReportTaskRepository();
const ceremonyRepo = new ReportCeremonyRepository();
const userRepo = new ReportUserRepository();
const trimesterRepo = new ReportTrimesterRepository();

export async function generatePDFReport(
  userId: string,
  type: string = "summary",
  trimesterParams?: { year?: number; number?: number }
): Promise<Buffer> {
  const [user, tasks, ceremonies, trimesters] = await Promise.all([
    userRepo.getUserById(userId),
    taskRepo.findAllByUser(userId),
    ceremonyRepo.findAllByUser(userId),
    trimesterRepo.findAll(),
  ]);

  let trimester = null;
  if (Array.isArray(trimesters) && trimesters.length > 0) {
    if (trimesterParams?.year && trimesterParams?.number) {
      trimester = trimesters.find(
        (t: any) =>
          t.year === trimesterParams.year && t.number === trimesterParams.number
      );
    }
    if (!trimester) {
      trimester = trimesters.reduce((a, b) => {
        if (a.year > b.year) return a;
        if (a.year < b.year) return b;
        return a.number > b.number ? a : b;
      });
    }
  }

  const taskMap = new Map();
  if (Array.isArray(tasks)) {
    tasks.forEach((task: any) => {
      taskMap.set(task.id, task);
    });
  }

  let filteredTasks = tasks;
  let filteredCeremonies = ceremonies;
  if (trimester) {
    const sprints = Array.isArray(trimester.sprints) ? trimester.sprints : [];
    const sprintIds = sprints.map((s: any) => s.id);
    filteredTasks = (tasks || []).filter((task: any) => {
      return task.userStory && sprintIds.includes(task.userStory.sprintId);
    });
    filteredCeremonies = (ceremonies || []).filter((c: any) =>
      sprintIds.includes(c.sprintId)
    );
  }

  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    // Cabeçalho
    doc.fontSize(20).text("Relatório de Produtividade", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`${user && user.name ? user.name : userId}`);
    if (user && user.email) doc.fontSize(10).text(`E-mail: ${user.email}`);
    doc.moveDown();
    // Resumo do Trimestre
    if (trimester) {
      doc
        .fontSize(14)
        .text(`Trimestre: ${trimester.year} - ${trimester.number}º trimestre`, {
          underline: true,
        });
      // Contagem de sprints, tarefas e cerimônias do trimestre
      const sprints = Array.isArray(trimester.sprints) ? trimester.sprints : [];
      // Contar tasks e ceremonies de todos os sprints
      let totalTasks = 0;
      let totalCeremonies = 0;
      sprints.forEach((s: any) => {
        if (Array.isArray(s.userStories)) {
          s.userStories.forEach((us: any) => {
            if (Array.isArray(us.tasks)) {
              totalTasks += us.tasks.length;
            }
          });
        }
        if (Array.isArray(s.ceremonies)) {
          totalCeremonies += s.ceremonies.length;
        }
      });
      doc.fontSize(12).text(`Sprints: ${sprints.length}`);
      doc.fontSize(12).text(`Tarefas: ${totalTasks}`);
      doc.fontSize(12).text(`Cerimônias: ${totalCeremonies}`);
      doc.moveDown();
    }

    if (type === "tasks" || type === "summary") {
      // Tarefas
      doc.fontSize(16).text("Tarefas", { underline: true });
      if (filteredTasks && filteredTasks.length) {
        filteredTasks.forEach((task: any) => {
          doc
            .fontSize(12)
            .text(`• ${task.title} (${task.category || "Sem categoria"})`);
          doc.fontSize(10).text(`   Status: ${task.status}`);
          if (task.description)
            doc.fontSize(10).text(`   Descrição: ${task.description}`);
          if (task.dueDate)
            doc
              .fontSize(10)
              .text(`   Prazo: ${new Date(task.dueDate).toLocaleString()}`);
          doc.moveDown(0.2);
        });
      } else {
        doc.fontSize(12).text("Nenhuma tarefa encontrada.");
      }
      doc.moveDown();
    }

    if (type === "ceremonies" || type === "summary") {
      // Cerimônias
      doc.fontSize(16).text("Cerimônias", { underline: true });
      let ceremoniesToShow = filteredCeremonies;
      if (ceremoniesToShow && ceremoniesToShow.length) {
        ceremoniesToShow.forEach((ceremony: any) => {
          doc
            .fontSize(12)
            .text(
              `• ${ceremony.type} | Início: ${new Date(
                ceremony.startTime
              ).toLocaleString()} | Fim: ${new Date(
                ceremony.endTime
              ).toLocaleString()}`
            );

          doc.moveDown(0.2);
        });
      } else {
        doc.fontSize(12).text("Nenhuma cerimônia encontrada.");
      }
      doc.moveDown();
    }
    doc.end();
  });
}

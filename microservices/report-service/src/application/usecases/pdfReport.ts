import PDFDocument from 'pdfkit';
import { ReportTaskRepository } from '@infrastructure/repositories/ReportTaskRepository';
import { ReportCeremonyRepository } from '@infrastructure/repositories/ReportCeremonyRepository';
import { ReportTimeLogRepository } from '@infrastructure/repositories/ReportTimeLogRepository';
import { ReportUserRepository } from '@infrastructure/repositories/ReportUserRepository';

const taskRepo = new ReportTaskRepository();
const ceremonyRepo = new ReportCeremonyRepository();
const timeLogRepo = new ReportTimeLogRepository();
const userRepo = new ReportUserRepository();

export async function generatePDFReport(userId: string, token: string): Promise<Buffer> {
  // Busca dados reais dos microserviços
  const [user, tasks, ceremonies, timeLogs] = await Promise.all([
    userRepo.getUserById(userId, token),
    taskRepo.findAllByUser(userId, token),
    ceremonyRepo.findAllByUser(userId, token),
    timeLogRepo.findAllByUser(userId, token)
  ]);

  // Cria um mapa de tasks para facilitar a exibição dos nomes nas seções de timeLogs
  const taskMap = new Map();
  if (Array.isArray(tasks)) {
    tasks.forEach((task: any) => {
      taskMap.set(task.id, task);
    });
  }

  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    // Cabeçalho
    doc.fontSize(20).text('Relatório de Produtividade', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Usuário: ${user && user.name ? user.name : userId}`);
    if (user && user.email) doc.fontSize(10).text(`E-mail: ${user.email}`);
    doc.moveDown();
    // Tarefas
    doc.fontSize(16).text('Tarefas', { underline: true });
    if (tasks && tasks.length) {
      tasks.forEach((task: any) => {
        doc.fontSize(12).text(`• ${task.title} (${task.category || 'Sem categoria'})`);
        doc.fontSize(10).text(`   Status: ${task.status} | Prioridade: ${task.priority}`);
        if (task.description) doc.fontSize(10).text(`   Descrição: ${task.description}`);
        if (task.dueDate) doc.fontSize(10).text(`   Prazo: ${new Date(task.dueDate).toLocaleString()}`);
        doc.moveDown(0.2);
      });
    } else {
      doc.fontSize(12).text('Nenhuma tarefa encontrada.');
    }
    doc.moveDown();
    // Cerimônias
    doc.fontSize(16).text('Cerimônias', { underline: true });
    if (ceremonies && ceremonies.length) {
      ceremonies.forEach((ceremony: any) => {
        doc.fontSize(12).text(`• ${ceremony.type} | Início: ${new Date(ceremony.startTime).toLocaleString()} | Fim: ${new Date(ceremony.endTime).toLocaleString()}`);
        if (ceremony.participants && ceremony.participants.length) {
          doc.fontSize(10).text(`   Participantes: ${ceremony.participants.join(', ')}`);
        }
        doc.moveDown(0.2);
      });
    } else {
      doc.fontSize(12).text('Nenhuma cerimônia encontrada.');
    }
    doc.moveDown();
    // Registros de Tempo
    doc.fontSize(16).text('Registros de Tempo', { underline: true });
    if (timeLogs && timeLogs.length) {
      timeLogs.forEach((log: any) => {
        const task = taskMap.get(log.taskId);
        doc.fontSize(12).text(`• Tarefa: ${task ? task.title : log.taskId}`);
        doc.fontSize(10).text(`   Início: ${new Date(log.startTime).toLocaleString()} | Fim: ${log.endTime ? new Date(log.endTime).toLocaleString() : 'Em andamento'} | Status: ${log.status}`);
      });
    } else {
      doc.fontSize(12).text('Nenhum registro de tempo encontrado.');
    }
    doc.end();
  });
}

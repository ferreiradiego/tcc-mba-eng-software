import { Router } from 'express';
import * as reportController from '@presentation/controllers/reportController';

const router = Router();

// Subgrupo: Relatórios de Tarefas
router.get('/tasks', reportController.tasksReport);
// Subgrupo: Relatórios de Cerimônias
router.get('/ceremonies', reportController.ceremoniesReport);
// Subgrupo: Relatório Resumido
router.get('/summary', reportController.summaryReport);
// Subgrupo: Exportação
router.get('/export', reportController.exportReport);

// Exemplos de erro
router.get('/error/unsupported-format', (req, res) => {
  res.status(400).json({ error: 'Formato não suportado' });
});

export default router;

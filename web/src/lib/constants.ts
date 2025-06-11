const USER_STORY_STATUS = [
  { value: "TODO", label: "A Fazer" },
  { value: "IN_PROGRESS", label: "Em Progresso" },
  { value: "DONE", label: "Concluída" },
  { value: "BLOCKED", label: "Bloqueada" },
];

const TASK_STATUS = [
  { value: "TODO", label: "A Fazer" },
  { value: "IN_PROGRESS", label: "Em Progresso" },
  { value: "DONE", label: "Concluída" },
];

const TASK_TYPE = [
  { value: "FEATURE", label: "Funcionalidade" },
  { value: "IMPROVEMENT", label: "Melhoria" },
  { value: "BUG", label: "Bug" },
  { value: "CODE_REVIEW", label: "Code Review" },
];

const CEREMONY_TYPE = [
  { value: "DAILY", label: "Daily" },
  { value: "PLANNING", label: "Planning" },
  { value: "REVIEW", label: "Review" },
  { value: "RETROSPECTIVE", label: "Retrospectiva" },
  { value: "OTHER", label: "Outro" },
];

export {
  USER_STORY_STATUS,
  TASK_STATUS,
  TASK_TYPE,
  CEREMONY_TYPE,
};

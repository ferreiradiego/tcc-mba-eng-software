import { CeremonyType, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.ceremony.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.userStory.deleteMany({});
  await prisma.sprint.deleteMany({});
  await prisma.trimester.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      permissions: ["ALL"],
    },
  });
  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
      permissions: ["READ", "WRITE"],
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@demo.com",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: adminRole.name,
    },
  });

  const trimester = await prisma.trimester.create({
    data: {
      year: 2025,
      number: 3,
      sprints: {
        create: [
          {
            name: "Sprint 1",
            startDate: new Date("2025-09-01"),
            endDate: new Date("2025-09-15"),
            ceremonies: {
              create: [
                {
                  type: CeremonyType.PLANNING,
                  typeDesc: "Sprint Planning",
                  scheduledAt: new Date("2025-09-01T09:00:00"),
                  startTime: new Date("2025-09-01T09:00:00"),
                  endTime: new Date("2025-09-01T10:00:00"),
                  duration: 60,
                  participants: [admin.email],
                },

                ...Array.from({ length: 15 }, (_, i) => ({
                  type: CeremonyType.DAILY,
                  typeDesc: "Daily Scrum",
                  scheduledAt: new Date(
                    `2025-09-${String(i + 1).padStart(2, "0")}T09:00:00`
                  ),
                  startTime: new Date(
                    `2025-09-${String(i + 1).padStart(2, "0")}T09:00:00`
                  ),
                  endTime: new Date(
                    `2025-09-${String(i + 1).padStart(2, "0")}T09:15:00`
                  ),
                  duration: 15,
                  participants: [admin.email],
                })),
                {
                  type: CeremonyType.REVIEW,
                  typeDesc: "Sprint Review",
                  scheduledAt: new Date("2025-09-15T10:00:00"),
                  startTime: new Date("2025-09-15T10:00:00"),
                  endTime: new Date("2025-09-15T11:00:00"),
                  duration: 60,
                  participants: [admin.email],
                },
                {
                  type: CeremonyType.RETROSPECTIVE,
                  typeDesc: "Sprint Retrospective",
                  scheduledAt: new Date("2025-09-15T11:15:00"),
                  startTime: new Date("2025-09-15T11:15:00"),
                  endTime: new Date("2025-09-15T12:00:00"),
                  duration: 45,
                  participants: [admin.email],
                },
              ],
            },
            userStories: {
              create: [
                {
                  title: "Login do Usuário",
                  description: "Como usuário, quero fazer login no sistema.",
                  status: "TODO",
                  tasks: {
                    create: [
                      {
                        userId: admin.id,
                        title: "Implementar backend de login",
                        description: "Criar API de autenticação",
                        status: "DONE",
                        type: "FEATURE",
                        dueDate: new Date("2025-09-01"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Implementar frontend de login",
                        description: "Criar tela de login",
                        status: "DONE",
                        type: "FEATURE",
                        dueDate: new Date("2025-09-02"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Testar login",
                        description: "Escrever testes automatizados para login",
                        status: "DONE",
                        type: "CODE_REVIEW",
                        dueDate: new Date("2025-09-03"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Implementar backend de recuperação de senha",
                        description: "API para reset de senha",
                        status: "IN_PROGRESS",
                        type: "FEATURE",
                        dueDate: new Date("2025-09-04"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Implementar frontend de recuperação de senha",
                        description: "Tela de recuperação de senha",
                        status: "IN_PROGRESS",
                        type: "FEATURE",
                        dueDate: new Date("2025-09-05"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Testar recuperação de senha",
                        description:
                          "Testes automatizados para recuperação de senha",
                        status: "TODO",
                        type: "CODE_REVIEW",
                        dueDate: new Date("2025-09-06"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Implementar backend de cadastro",
                        description: "API para cadastro de usuário",
                        status: "TODO",
                        type: "FEATURE",
                        dueDate: new Date("2025-09-07"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Implementar frontend de cadastro",
                        description: "Tela de cadastro de usuário",
                        status: "TODO",
                        type: "FEATURE",
                        dueDate: new Date("2025-09-08"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Testar cadastro de usuário",
                        description: "Testes automatizados para cadastro",
                        status: "TODO",
                        type: "CODE_REVIEW",
                        dueDate: new Date("2025-09-09"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Revisar integrações de autenticação",
                        description: "Revisão de código e integração",
                        status: "TODO",
                        type: "CODE_REVIEW",
                        dueDate: new Date("2025-09-10"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Testar fluxo completo de autenticação",
                        description: "Testes end-to-end",
                        status: "TODO",
                        type: "CODE_REVIEW",
                        dueDate: new Date("2025-09-11"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Documentar autenticação",
                        description: "Documentação técnica e de API",
                        status: "TODO",
                        type: "IMPROVEMENT",
                        dueDate: new Date("2025-09-12"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Preparar deploy da sprint",
                        description: "Ajustes finais e publicação",
                        status: "TODO",
                        type: "IMPROVEMENT",
                        dueDate: new Date("2025-09-13"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Revisar entregas da sprint",
                        description: "Checklist e revisão final",
                        status: "TODO",
                        type: "CODE_REVIEW",
                        dueDate: new Date("2025-09-15"),
                        estimatedTime: 480,
                      },
                    ],
                  },
                },
                {
                  title: "Gestão de Usuários",
                  description:
                    "Como administrador, quero gerenciar usuários do sistema.",
                  status: "IN_PROGRESS",
                  tasks: {
                    create: [
                      {
                        userId: admin.id,
                        title: "Criar interface de gestão de usuários",
                        description: "Painel administrativo para usuários",
                        status: "IN_PROGRESS",
                        type: "IMPROVEMENT",
                        dueDate: new Date("2025-09-05"),
                        estimatedTime: 480,
                      },
                      {
                        userId: admin.id,
                        title: "Implementar backend de gestão de usuários",
                        description: "Endpoints para CRUD de usuários",
                        status: "TODO",
                        type: "FEATURE",
                        dueDate: new Date("2025-09-06"),
                        estimatedTime: 480,
                      },
                    ],
                  },
                },
                {
                  title: "Dashboard do Sistema",
                  description:
                    "Como usuário, quero visualizar um dashboard com informações do projeto.",
                  status: "TODO",
                  tasks: {
                    create: [
                      {
                        userId: admin.id,
                        title: "Implementar API do dashboard",
                        description: "Endpoints para dados do dashboard",
                        status: "TODO",
                        type: "FEATURE",
                        dueDate: new Date("2025-09-09"),
                        estimatedTime: 480,
                      },
                    ],
                  },
                },
                {
                  title: "Reuniões e Cerimônias",
                  description:
                    "Como time, queremos realizar reuniões diárias e de revisão.",
                  status: "TODO",
                  tasks: {
                    create: [],
                  },
                },
                {
                  title: "Aprimoramento e Refatoração",
                  description:
                    "Como desenvolvedor, quero refatorar e melhorar o código.",
                  status: "TODO",
                  tasks: {
                    create: [
                      {
                        userId: admin.id,
                        title: "Refatorar código do backend",
                        description: "Melhorias e ajustes no backend",
                        status: "TODO",
                        type: "IMPROVEMENT",
                        dueDate: new Date("2025-09-12"),
                        estimatedTime: 8,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seed completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

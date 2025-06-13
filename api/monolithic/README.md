# Monolithic API

Esta pasta conterá a versão monolítica da API, unificando a lógica dos microserviços existentes: auth-service, scrum-service, report-service e gateway.

## Estrutura sugerida

- `src/` - Código-fonte principal
- `src/application/` - Lógica de aplicação
- `src/domain/` - Entidades e regras de negócio
- `src/infrastructure/` - Integrações externas, banco de dados, etc.
- `src/presentation/` - Rotas e controladores HTTP
- `prisma/` - Schema e migrações do banco de dados

A lógica de cada microserviço será adaptada para funcionar em módulos dentro do monolito, compartilhando infraestrutura e banco de dados.

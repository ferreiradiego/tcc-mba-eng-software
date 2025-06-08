# Notification Service

Microserviço responsável pelo envio de notificações aos usuários sobre prazos de tarefas, lembretes de cerimônias e outras informações relevantes.

## Endpoints
- POST /notifications/send
- POST /notifications/preferences

## Funcionalidades
- Envio de notificações por e-mail
- Configuração de preferências de notificação

## Estrutura Sugerida
- src/domain: entidades e interfaces
- src/application: casos de uso
- src/infrastructure: repositórios, serviços de e-mail
- src/presentation: controllers, rotas

## Como rodar
1. Instale as dependências: `npm install`
2. Configure o serviço de e-mail no arquivo `.env`:

   Para Gmail, gere uma senha de app em https://myaccount.google.com/apppasswords e preencha as variáveis:
   
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=seu_email@gmail.com
   EMAIL_PASS=sua_senha_de_app
   EMAIL_FROM="Nome do Remetente <seu_email@gmail.com>"
   ```

   Para outros provedores SMTP, ajuste as variáveis conforme necessário.
3. Inicie o serviço: `npm run dev`

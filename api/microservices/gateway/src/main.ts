import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.WEB_APP_URL || "http://localhost:3007"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  if (req.path.startsWith("/auth")) return next();
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido" });
  const [, token] = authHeader.split(" ");
  try {
    jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
});

app.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    changeOrigin: true,
  })
);
app.use(
  "/tasks",
  createProxyMiddleware({
    target: process.env.TASK_SERVICE_URL || "http://localhost:3002",
    changeOrigin: true,
  })
);
app.use(
  "/timelogs",
  createProxyMiddleware({
    target: process.env.TIMELOG_SERVICE_URL || "http://localhost:3003",
    changeOrigin: true,
  })
);
app.use(
  "/ceremonies",
  createProxyMiddleware({
    target: process.env.SCRUM_SERVICE_URL || "http://localhost:3004",
    changeOrigin: true,
  })
);
app.use(
  "/reports",
  createProxyMiddleware({
    target: process.env.REPORT_SERVICE_URL || "http://localhost:3005",
    changeOrigin: true,
  })
);
app.use(
  "/notifications",
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3006",
    changeOrigin: true,
  })
);

app.get("/", (req, res) => res.send("API Gateway Running"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});

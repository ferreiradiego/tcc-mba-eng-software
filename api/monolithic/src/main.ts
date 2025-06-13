import authRoutes from "@presentation/routes/authRoutes";
import reportRoutes from "@presentation/routes/reportRoutes";
import scrumRoutes from "@presentation/routes/scrumRoutes";
import cors from "cors";
import express, { json } from "express";

const app = express();
app.use(json());

app.use(
  cors({
    origin: [process.env.WEB_APP_URL || "http://localhost:3000"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/scrum", scrumRoutes);
app.use("/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("Monolithic API is running");
});

const PORT = process.env.PORT || 4010;
app.listen(PORT, () => {
  console.log(`Monolithic API listening on port ${PORT}`);
});

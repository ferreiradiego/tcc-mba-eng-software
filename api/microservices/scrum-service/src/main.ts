import ceremonyRoutes from "@presentation/routes/ceremonyRoutes";
import taskRoutes from "@presentation/routes/taskRoutes";
import timelogRoutes from "@presentation/routes/timelogRoutes";
import userStoryRoutes from "@presentation/routes/userStoryRoutes";
import sprintRoutes from "@presentation/routes/sprintRoutes";
import trimesterRoutes from "@presentation/routes/trimesterRoutes";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/ceremonies", ceremonyRoutes);
app.use("/tasks", taskRoutes);
app.use("/timelogs", timelogRoutes);
app.use("/user-stories", userStoryRoutes);
app.use("/sprints", sprintRoutes);
app.use("/trimesters", trimesterRoutes);

app.get("/", (req, res) => res.send("Scrum Service Running"));

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Scrum service listening on port ${PORT}`);
});

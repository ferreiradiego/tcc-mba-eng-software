import express from "express";
import { json } from "express";
import authRoutes from "@presentation/routes/authRoutes";
import scrumRoutes from "@presentation/routes/scrumRoutes";
import reportRoutes from "@presentation/routes/reportRoutes";

const app = express();
app.use(json());


app.use("/auth", authRoutes); 
app.use("/scrum", scrumRoutes);
app.use("/report", reportRoutes);

app.get("/", (req, res) => {
  res.send("Monolithic API is running");
});

const PORT = process.env.PORT || 4010;
app.listen(PORT, () => {
  console.log(`Monolithic API listening on port ${PORT}`);
});

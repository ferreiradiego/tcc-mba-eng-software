import express from "express";
import dotenv from "dotenv";
import authRoutes from "@presentation/routes/authRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => res.send("Auth Service Running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});

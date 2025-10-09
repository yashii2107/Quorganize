import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import questionRoutes from "./routes/question.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

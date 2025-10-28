import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import questionRoutes from "./routes/question.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import path from "path";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/questions", questionRoutes);
app.use("/api/topics", topicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

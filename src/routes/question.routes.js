import express from "express";
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from "../controllers/question.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", upload.single("solutionImage"), createQuestion);
router.get("/", getQuestions);
router.patch("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;

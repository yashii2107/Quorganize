import express from "express";
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getStats,
  getQuestionTypes,
} from "../controllers/question.controller.js";


const router = express.Router();

router.get("/types",getQuestionTypes );
router.get("/stats", getStats);
router.get("/", getQuestions);
router.get("/:id", getQuestion);
router.post("/", createQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;
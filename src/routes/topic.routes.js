import express from "express";
import {
  createTopic,
  getTopics,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller.js";

const router = express.Router();

router.post("/", createTopic);
router.get("/", getTopics);
router.patch("/:id", updateTopic);
router.delete("/:id", deleteTopic);

export default router;

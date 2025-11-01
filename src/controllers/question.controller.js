import Question from "../models/question.model.js";

export const createQuestion = async (req, res) => {
  try {
    const {
      question,
      section,
      difficulty,
      topics,
      solutionCode,
      notes,
    } = req.body;

    // Only allow moving to completed/revision if solution exists
    if ((section === "completed" || section === "revision") && !solutionCode) {
      return res.status(400).json({
        message: "Solution required to move question to completed/revision",
      });
    }

    const newQ = await Question.create({
      question,
      section,
      difficulty,
      topics,
      solutionCode,
      notes,
      solutionImage: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json(newQ);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.section) filter.section = req.query.section;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.topic) filter.topics = req.query.topic;

    const questions = await Question.find(filter).populate("topics");
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("topics");
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question", error });
  }
};

export const getStats = async (req, res) => {
  try {
    const total = await Question.countDocuments();
    const todoCount = await Question.countDocuments({ section: "todo" });
    const completedCount = await Question.countDocuments({ section: "completed" });
    const revisionCount = await Question.countDocuments({ section: "revision" });

    const easyCount = await Question.countDocuments({ difficulty: "easy" });
    const mediumCount = await Question.countDocuments({ difficulty: "medium" });
    const hardCount = await Question.countDocuments({ difficulty: "hard" });

    res.status(200).json({
      total,
      sectionCounts: {
        todo: todoCount,
        completed: completedCount,
        revision: revisionCount,
      },
      difficultyCounts: {
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Not found" });

    // Cannot move back to TODO if solution exists
    if (updates.section === "todo" && question.solutionCode) {
      return res.status(400).json({
        message: "Cannot move back to TODO if a solution exists",
      });
    }

    // Prevent editing topics
    if (updates.topics) delete updates.topics;

    const updated = await Question.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

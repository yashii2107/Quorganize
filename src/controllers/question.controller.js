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

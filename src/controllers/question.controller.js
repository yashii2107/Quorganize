import Question from "../models/question.model.js";
export const getQuestions = async (req, res) => {
  try {
    const { section, difficulty, questionType, tag, search } = req.query;

    const filter = {};

    if (section) filter.section = section;
    if (difficulty) filter.difficulty = difficulty;
    if (questionType) filter.questionType = questionType;
    if (tag) filter.tags = { $in: Array.isArray(tag) ? tag : [tag] };
    if (search) filter.title = { $regex: search, $options: "i" }; 

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/questions/:id

export const getQuestion = async (req, res)=>{
    try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: "Question not found" });
    res.json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/questions
export const createQuestion = async (req, res) => {
  try {
    const { title, solution, questionType, section, difficulty, tags } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    // If user sets section to 'completed' without solution → reject
    if ((section === "completed") && !solution) {
      return res.status(400).json({ message: "Solution required when creating a completed question" });
    }

    const q = new Question({
      title,
      solution: solution || "",
      questionType: questionType || "",
      section: solution ? "completed" : (section || "todo"),
      difficulty: difficulty || "Easy",
      tags: tags || []
    });

    const saved = await q.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



export const updateQuestion = async (req, res) => {
  try {
    const { title, solution, section, difficulty, tags, questionType } = req.body;

    if (questionType !== undefined) {
      return res.status(400).json({ message: "questionType cannot be updated" });
    }

    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: "Question not found" });

    if (title !== undefined) q.title = title;
    if (solution !== undefined) {
      q.solution = solution;
      q.section = "completed"; // move to completed when solution provided
    }
    if (section !== undefined) q.section = section;
    if (difficulty !== undefined) q.difficulty = difficulty;
    if (tags !== undefined) q.tags = tags;

    // If after updates the question is in 'completed' section, ensure solution exists
    if (q.section === "completed" && (!q.solution || q.solution.trim() === "")) {
      return res.status(400).json({ message: "Completed questions must have a solution" });
    }

    const updated = await q.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const total = await Question.countDocuments();
    const todo = await Question.countDocuments({ section: "todo" });
    const completed = await Question.countDocuments({ section: "completed" });
    const easy = await Question.countDocuments({ difficulty: "Easy" });
    const medium = await Question.countDocuments({ difficulty: "Medium" });
    const hard = await Question.countDocuments({ difficulty: "Hard" });

    res.json({ total, todo, completed, easy, medium, hard });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuestionTypes = async (req, res) => {
  try {
    const types = await Question.distinct("questionType", { questionType: { $exists: true, $ne: "" }});
    // `distinct` returns an array of unique values; respond directly
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
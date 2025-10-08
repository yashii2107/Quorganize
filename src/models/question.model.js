import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    title: {type: String, required: true},
    solution: { type: String, default: "" },
    section:  {type: String, enum: ["todo","completed"], default: "todo"},
    difficulty: {type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy"},
    questionType: { type: String, trim: true, default: "" },
    tags: { type: [String], default: [] }      // Optional tags (e.g., array, dp)
}, { timestamps: true });
export default mongoose.model("Question", QuestionSchema);
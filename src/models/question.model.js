import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      title: { type: String, required: true },
      link: { type: String },
      example: {
        input: { type: String },
        output: { type: String },
      },
    },
    section: {
      type: String,
      enum: ["todo", "completed", "revision"],
      default: "todo",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],

    solutionCode: { type: String },
    solutionImage: { type: String },
    notes: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);

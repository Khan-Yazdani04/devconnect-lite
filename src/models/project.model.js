import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, "Project budget is required"],
      min: [1, "Budget must be greater than zero"],
    },
    deadline: {
      type: Date,
      required: [true, "Project deadline is required"],
    },
    techStack: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["open", "in progress", "completed", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: make sure deadline is not in the past
projectSchema.pre("save", function (next) {
  if (this.deadline && this.deadline < new Date()) {
    return next(new Error("Deadline cannot be in the past"));
  }
  next();
});

export const Project = mongoose.model("Project", projectSchema);

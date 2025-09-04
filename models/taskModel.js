import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Task name is required"],
    trim: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId, // reference team
    ref: "Teams",
    required: true,
  },
  members: [ // array of User IDs
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    }
  ],
  status: {
    type: String,
    enum: ["todo", "inProgress", "completed", "deleted"],
    default: "todo",
  },
  notes: {
    type: String,
    trim: true,
    default: "",
  },
  dueDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false, // ✅ this is key for the Archive table
  },
}, { timestamps: true });

// Optional: a virtual field for completed status
taskSchema.virtual("completed").get(function () {
  return this.status === "completed";
});

export default mongoose.model("Tasks", taskSchema);

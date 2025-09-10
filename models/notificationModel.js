import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  type: {
    type: String,
    enum: ["task_created", "task_assigned", "task_completed", "task_updated", "user_mentioned"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export default mongoose.model("Notifications", notificationSchema);

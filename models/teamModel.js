import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active", // ✅ teams are active by default
    },
    deleted: {
      type: Boolean,
      default: false, // optional, but useful for quick filters
    },
  },
  { timestamps: true }
);

// Optional virtual for checking if archived
teamSchema.virtual("isArchived").get(function () {
  return this.status === "archived";
});

const Team = mongoose.model("Teams", teamSchema);

export default Team;

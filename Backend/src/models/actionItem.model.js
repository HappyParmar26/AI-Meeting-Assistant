const mongoose = require("mongoose");

const actionItemSchema = new mongoose.Schema(
    {
        meetingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meeting",
            required: true,
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        task: {
            type: String,
            required: true,
            trim: true,
        },

        dueDate: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ActionItem", actionItemSchema);
const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema(
    {
        meetingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meeting",
            required: true,
            unique: true,
        },

        summaryText: {
            type: String,
            required: true,
            trim: true,
        },

        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Summary", summarySchema);
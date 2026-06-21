const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema(
    {
        meetingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meeting",
            required: true,
        },

        speakerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        speakerName: {
            type: String,
            required: true,
        },

        text: {
            type: String,
            required: true,
            trim: true,
        },

        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transcript", transcriptSchema);
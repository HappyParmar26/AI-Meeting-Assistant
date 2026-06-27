const Transcript = require("../models/transcript.model");

// Save Transcript
async function saveTranscript(req, res) {
    try {
        const {
            meetingId,
            speakerId,
            speakerName,
            text,
            timestamp
        } = req.body;

        const transcript = await Transcript.create({
            meetingId,
            speakerId,
            speakerName,
            text,
            timestamp
        });

        res.status(201).json({
            success: true,
            message: "Transcript saved successfully.",
            data: transcript
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get All Transcripts of a Meeting
async function getTranscript(req, res) {
    try {
        const { meetingId } = req.params;

        const transcripts = await Transcript.find({ meetingId })
            .sort({ timestamp: 1 });

        res.status(200).json({
            success: true,
            count: transcripts.length,
            data: transcripts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Delete Transcript
async function deleteTranscript(req, res) {
    try {
        const { id } = req.params;

        const transcript = await Transcript.findByIdAndDelete(id);

        if (!transcript) {
            return res.status(404).json({
                success: false,
                message: "Transcript not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Transcript deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    saveTranscript,
    getTranscript,
    deleteTranscript
};
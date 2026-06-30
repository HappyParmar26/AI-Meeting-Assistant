const Recording = require("../models/recording.model");

// Upload Recording
async function uploadRecording(req, res) {
    try {
        const { meetingId, recordingUrl } = req.body;

        if (!meetingId || !recordingUrl) {
            return res.status(400).json({
                success: false,
                message: "Meeting ID and Recording URL are required"
            });
        }

        const recording = await Recording.create({
            meetingId,
            recordingUrl
        });

        res.status(201).json({
            success: true,
            message: "Recording uploaded successfully",
            data: recording
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get Recording by Meeting ID
async function getRecording(req, res) {
    try {
        const { meetingId } = req.params;

        const recording = await Recording.findOne({ meetingId });

        if (!recording) {
            return res.status(404).json({
                success: false,
                message: "Recording not found"
            });
        }

        res.status(200).json({
            success: true,
            data: recording
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    uploadRecording,
    getRecording
};
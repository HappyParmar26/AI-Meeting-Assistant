const Summary = require('../models/summary.model');
const Transcript = require('../models/transcript.model');
const AIService = require('../services/ai.service');

// Generate (Save) Summary
async function generateSummary(req, res) {
    try {
        const { meetingId, summaryText } = req.body;

        if (!meetingId) {
            return res.status(400).json({
                success: false,
                message: 'Meeting ID is required.',
            });
        }

        let generatedSummary = summaryText;

        if (!generatedSummary) {
            const transcriptEntries = await Transcript.find({ meetingId }).sort({ timestamp: 1 });
            if (!transcriptEntries.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Transcript not found for this meeting.',
                });
            }

            const transcriptText = transcriptEntries
                .map((entry) => `${entry.speakerName || 'Speaker'}: ${entry.text}`)
                .join('\n');

            generatedSummary = await AIService.generateSummary(transcriptText);
        }

        const summary = await Summary.findOneAndUpdate(
            { meetingId },
            { meetingId, summaryText: generatedSummary },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(201).json({
            success: true,
            message: 'Summary generated successfully.',
            data: summary,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to generate summary.',
            error: error.message,
        });
    }
}

// Get Summary by Meeting ID
async function getSummary(req, res) {
    try {
        const { meetingId } = req.params;

        const summary = await Summary.findOne({ meetingId });

        if (!summary) {
            return res.status(404).json({
                success: false,
                message: "Summary not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch summary.",
            error: error.message
        });
    }
}

module.exports = {
    generateSummary,
    getSummary
};
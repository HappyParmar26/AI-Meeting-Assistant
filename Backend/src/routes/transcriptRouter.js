const express = require("express");

const {
    saveTranscript,
    getTranscript,
    deleteTranscript,
} = require("../controllers/transcript.controller");

const router = express.Router();

// Save Transcript
router.post("/transcript", saveTranscript);

// Get All Transcripts of a Meeting
router.get("/transcript/:meetingId", getTranscript);

// Delete Transcript
router.delete("/transcript/:id", deleteTranscript);

module.exports = router;
const express = require("express");

const {
    saveTranscript,
    getTranscript,
    deleteTranscript,
} = require("../controllers/transcript.controller");

const router = express.Router();

// Save Transcript
router.post("/", saveTranscript);

// Get All Transcripts of a Meeting
router.get("/:meetingId", getTranscript);

// Delete Transcript
router.delete("/:id", deleteTranscript);

module.exports = router;
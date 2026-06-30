const express = require("express");
const router = express.Router();

const {
    uploadRecording,
    getRecording
} = require("../controllers/recording.controller");

// Upload recording
router.post("/upload", uploadRecording);

// Get recording by meeting ID
router.get("/:meetingId", getRecording);

module.exports = router;
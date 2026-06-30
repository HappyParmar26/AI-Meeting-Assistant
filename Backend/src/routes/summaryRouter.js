const express = require("express");
const router = express.Router();

const {
    generateSummary,
    getSummary
} = require("../controllers/summary.controller");

// Generate Summary
router.post("/generate", generateSummary);

// Get Summary by Meeting ID
router.get("/:meetingId", getSummary);

module.exports = router;
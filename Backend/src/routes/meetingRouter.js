const express = require("express");

const  router = express.Router();

const {
    createMeeting,
    joinMeeting,
    leaveMeeting,
    startMeeting,
    endMeeting,
    getMeeting,
    getMeetingHistory,
} = require("../controllers/meeting.controller");

const authMiddleware = require("../middleware/auth.middleware");

// Create a meeting
router.post("/create", authMiddleware, createMeeting);

// Join a meeting
router.post("/join/:id", authMiddleware, joinMeeting);

// Leave a meeting
router.post("/leave/:id", authMiddleware, leaveMeeting);

// Start a meeting
router.post("/start/:id", authMiddleware, startMeeting);

// End a meeting
router.post("/end/:id", authMiddleware, endMeeting);

// Get meeting details
router.get("/:id", authMiddleware, getMeeting);

// Get meeting history
router.get("/history/all", authMiddleware, getMeetingHistory);

module.exports = router;
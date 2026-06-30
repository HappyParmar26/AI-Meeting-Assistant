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

const authMiddleware = require("../middlewares/auth.middleware");

// Create a meeting
router.post("/create", authMiddleware.authUser, createMeeting);

// Join a meeting
router.post("/join/:id", authMiddleware.authUser, joinMeeting);

// Leave a meeting
router.post("/leave/:id", authMiddleware.authUser, leaveMeeting);

// Start a meeting
router.post("/start/:id", authMiddleware.authUser, startMeeting);

// End a meeting
router.post("/end/:id", authMiddleware.authUser, endMeeting);

// Get meeting history
router.get("/history/all", authMiddleware.authUser, getMeetingHistory);

// Get meeting details
router.get("/:id", authMiddleware.authUser, getMeeting);

module.exports = router;
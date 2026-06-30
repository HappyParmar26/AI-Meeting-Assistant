const Meeting = require("../models/meeting.model");
const meetingService = require("../services/meeting.service");

// Create Meeting
async function createMeeting(req, res) {
    try {
        const { title, description = '', date, startTime, participants } = req.body;

        const meeting = await meetingService.createMeeting({
            title,
            description,
            date,
            startTime,
            owner: req.user.id,
            participants: participants || [],
            meetingCode: meetingService.generateMeetingCode(),
            status: "scheduled",
        });

        res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            meeting,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create meeting",
            error: err.message,
        });
    }
}

// Join Meeting
async function joinMeeting(req, res) {
    try {
        const meeting = await meetingService.addParticipant(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Joined meeting successfully",
            meeting,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to join meeting",
            error: err.message,
        });
    }
}

// Leave Meeting
async function leaveMeeting(req, res) {
    try {
        const meeting = await meetingService.removeParticipant(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Left meeting successfully",
            meeting,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to leave meeting",
            error: err.message,
        });
    }
}

// Start Meeting
async function startMeeting(req, res) {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }

        meeting.status = "ongoing";
        meeting.startedAt = new Date();

        await meeting.save();

        res.status(200).json({
            success: true,
            message: "Meeting started successfully",
            meeting,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to start meeting",
            error: err.message,
        });
    }
}

// End Meeting
async function endMeeting(req, res) {
    try {
        const meeting = await meetingService.endMeeting(req.params.id);

        res.status(200).json({
            success: true,
            message: "Meeting ended successfully",
            meeting,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to end meeting",
            error: err.message,
        });
    }
}

// Get Single Meeting
async function getMeeting(req, res) {
    try {
        const meeting = await Meeting.findById(req.params.id)
            .populate("owner", "username email")
            .populate("participants", "username email");

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }
        res.status(200).json({
            success: true,
            meeting,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve meeting",
            error: err.message,
        });
    }
}

// Get Meeting History
async function getMeetingHistory(req, res) {
    try {
        const meetings = await Meeting.find({
            $or: [
                { owner: req.user.id },
                { participants: req.user.id },
            ],
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            meetings,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch meeting history",
            error: err.message,
        });
    }
}

module.exports = {
    createMeeting,
    joinMeeting,
    leaveMeeting,
    startMeeting,
    endMeeting,
    getMeeting,
    getMeetingHistory,
};
const Meeting = require("../models/meeting.model");

// Create Meeting
async function createMeeting(req, res) {
    try {
        const { title, participants } = req.body;

        const meeting = await Meeting.create({
            title,
            owner: req.user.id,
            participants: participants || [],
            status: "scheduled",
            startedAt: null,
            endedAt: null,
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

// Get Single Meeting
async function getMeeting(req, res) {
    try {
        const meeting = await Meeting.findById(req.params.id)
            .populate("owner", "name email")
            .populate("participants", "name email");

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

// Join Meeting
async function joinMeeting(req, res) {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }

        if (!meeting.participants.includes(req.user.id)) {
            meeting.participants.push(req.user.id);
            await meeting.save();
        }

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
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }

        meeting.participants = meeting.participants.filter(
            (participant) => participant.toString() !== req.user.id
        );

        await meeting.save();

        res.status(200).json({
            success: true,
            message: "Left meeting successfully",
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
            message: "Meeting started",
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
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }

        meeting.status = "completed";
        meeting.endedAt = new Date();

        await meeting.save();

        res.status(200).json({
            success: true,
            message: "Meeting ended",
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

// Get Meeting History
async function getMeetingHistory(req, res) {
    try {
        const meetings = await Meeting.find({
            $or: [
                { owner: req.user.id },
                { participants: req.user.id },
            ],
        })
            .sort({ createdAt: -1 })
            .populate("owner", "name email");

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
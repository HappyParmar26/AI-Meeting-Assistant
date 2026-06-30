const mongoose = require('mongoose');
const ActionItem = require('../models/actionItem.model');
const Transcript = require('../models/transcript.model');
const Notification = require('../models/notification.model');
const Meeting = require('../models/meeting.model');
const User = require('../models/user.model');
const AIService = require('../services/ai.service');

function parseActionItemText(aiResponse) {
    const lines = (aiResponse || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    const parsedItems = [];

    for (const line of lines) {
        const cleaned = line.replace(/^[-*•]\s*/, '');
        const taskMatch = cleaned.match(/task\s*[:\-]\s*(.+)/i);
        const responsibleMatch = cleaned.match(/responsible(?:\s+person)?\s*[:\-]\s*(.+)/i);
        const deadlineMatch = cleaned.match(/deadline\s*[:\-]\s*(.+)/i);

        parsedItems.push({
            task: taskMatch ? taskMatch[1].trim() : cleaned,
            assignedText: responsibleMatch ? responsibleMatch[1].trim() : null,
            dueDateText: deadlineMatch ? deadlineMatch[1].trim() : null,
        });
    }

    return parsedItems;
}

async function resolveAssignedUser(meeting, assignedText) {
    if (!assignedText) {
        return meeting.owner || null;
    }

    if (mongoose.Types.ObjectId.isValid(assignedText)) {
        return assignedText;
    }

    const candidate = assignedText.trim();

    const matchingUser = await User.findOne({
        $or: [
            { username: { $regex: `^${candidate}$`, $options: 'i' } },
            { email: { $regex: `^${candidate}$`, $options: 'i' } },
        ],
    });

    if (matchingUser) {
        return matchingUser._id;
    }

    if (meeting.participants?.length) {
        const participantUsers = await User.find({
            _id: { $in: meeting.participants },
        });

        const participantMatch = participantUsers.find((user) => {
            return [user.username, user.email].some((value) =>
                value?.toLowerCase().includes(candidate.toLowerCase())
            );
        });

        if (participantMatch) {
            return participantMatch._id;
        }
    }

    return meeting.owner || null;
}

// Generate Action Items
async function generateActionItems(req, res) {
    try {
        const { meetingId } = req.body;

        if (!meetingId) {
            return res.status(400).json({
                success: false,
                message: 'Meeting ID is required.',
            });
        }

        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found.',
            });
        }

        const transcriptEntries = await Transcript.find({ meetingId }).sort({ timestamp: 1 });
        if (!transcriptEntries.length) {
            return res.status(404).json({
                success: false,
                message: 'Transcript not found.',
            });
        }

        const transcriptText = transcriptEntries
            .map((entry) => `${entry.speakerName || 'Speaker'}: ${entry.text}`)
            .join('\n');

        const aiResponse = await AIService.extractActionItems(transcriptText);
        const parsedItems = parseActionItemText(aiResponse);

        if (!parsedItems.length) {
            return res.status(200).json({
                success: true,
                message: 'No action items were detected.',
                data: [],
            });
        }

        const savedActionItems = [];

        for (const item of parsedItems) {
            const assignedTo = await resolveAssignedUser(meeting, item.assignedText);
            const actionItem = await ActionItem.create({
                meetingId,
                assignedTo,
                task: item.task,
                status: 'pending',
            });

            await Notification.create({
                userId: assignedTo || meeting.owner,
                meetingId,
                type: 'action-item',
                actionItemId: actionItem._id,
                message: `New action item assigned: ${item.task}`,
            });

            savedActionItems.push(actionItem);
        }

        res.status(201).json({
            success: true,
            message: 'Action items generated successfully.',
            data: savedActionItems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Get Action Items
async function getActionItems(req, res) {
    try {
        const { meetingId } = req.params;
        const items = await ActionItem.find({ meetingId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            data: items,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Update Status
async function updateStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const item = await ActionItem.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Action item not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Status updated successfully.',
            data: item,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Delete Action Item
async function deleteActionItem(req, res) {
    try {
        const { id } = req.params;
        const item = await ActionItem.findByIdAndDelete(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Action item not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Action item deleted successfully.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    generateActionItems,
    getActionItems,
    updateStatus,
    deleteActionItem,
};
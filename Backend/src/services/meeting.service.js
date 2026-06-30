const Meeting = require("../models/meeting.model");

// Generate Random Meeting Code
function generateMeetingCode(length = 6) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
        code += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return code;
}

// Create Meeting
async function createMeeting(data) {
    return await Meeting.create(data);
}

// Add Participant
async function addParticipant(meetingId, userId) {
    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
        throw new Error("Meeting not found");
    }

    const alreadyJoined = meeting.participants.some(
        (participant) => participant.toString() === userId
    );

    if (!alreadyJoined) {
        meeting.participants.push(userId);
        await meeting.save();
    }

    return meeting;
}

// Remove Participant
async function removeParticipant(meetingId, userId) {
    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
        throw new Error("Meeting not found");
    }

    meeting.participants = meeting.participants.filter(
        (participant) => participant.toString() !== userId
    );

    await meeting.save();

    return meeting;
}

// End Meeting
async function endMeeting(meetingId) {
    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
        throw new Error("Meeting not found");
    }

    meeting.status = "completed";
    meeting.endedAt = new Date();

    await meeting.save();

    return meeting;
}

module.exports = {
    generateMeetingCode,
    createMeeting,
    addParticipant,
    removeParticipant,
    endMeeting,
};
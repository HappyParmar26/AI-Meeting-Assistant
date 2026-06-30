// socket/meetingSocket.js

const Transcript = require('../models/transcript.model');

const activeUsers = new Map();

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`Socket Connected: ${socket.id}`);

        /**
         * Join Meeting Room
         */
        socket.on("joinMeeting", ({ meetingId, userId, username }) => {
            socket.join(meetingId);

            if (!activeUsers.has(meetingId)) {
                activeUsers.set(meetingId, []);
            }

            const users = activeUsers.get(meetingId);

            const alreadyExists = users.find((u) => u.userId === userId);

            if (!alreadyExists) {
                users.push({
                    socketId: socket.id,
                    userId,
                    username,
                });
            }

            activeUsers.set(meetingId, users);

            io.to(meetingId).emit("participantJoined", {
                userId,
                username,
                participants: users,
            });

            console.log(`${username} joined ${meetingId}`);
        });

        /**
         * Leave Meeting
         */
        socket.on("leaveMeeting", ({ meetingId, userId }) => {
            if (!activeUsers.has(meetingId)) return;

            let users = activeUsers.get(meetingId);

            users = users.filter((u) => u.userId !== userId);

            activeUsers.set(meetingId, users);

            socket.leave(meetingId);

            io.to(meetingId).emit("participantLeft", {
                userId,
                participants: users,
            });

            console.log(`${userId} left ${meetingId}`);
        });

        /**
         * Meeting Started
         */
        socket.on("startMeeting", ({ meetingId }) => {
            io.to(meetingId).emit("meetingStarted", {
                message: "Meeting has started.",
            });
        });

        /**
         * Live Transcript Update
         */
        socket.on("transcriptUpdate", async ({ meetingId, transcript, speakerId, speakerName }) => {
            try {
                const savedTranscript = await Transcript.create({
                    meetingId,
                    speakerId,
                    speakerName: speakerName || 'Speaker',
                    text: transcript,
                    timestamp: new Date(),
                });

                io.to(meetingId).emit("transcriptUpdated", {
                    transcript: savedTranscript,
                });
            } catch (error) {
                console.error('Failed to save transcript update:', error.message);
            }
        });

        /**
         * AI Summary Update
         */
        socket.on("summaryGenerated", ({ meetingId, summary }) => {
            io.to(meetingId).emit("summaryUpdated", {
                summary,
            });
        });

        /**
         * Action Items Generated
         */
        socket.on("actionItemsGenerated", ({ meetingId, actionItems }) => {
            io.to(meetingId).emit("actionItemsUpdated", {
                actionItems,
            });
        });

        /**
         * Meeting Ended
         */
        socket.on("endMeeting", ({ meetingId }) => {
            io.to(meetingId).emit("meetingEnded", {
                message: "Meeting has ended.",
            });

            activeUsers.delete(meetingId);
        });

        /**
         * Disconnect
         */
        socket.on("disconnect", () => {
            console.log(`Socket Disconnected: ${socket.id}`);

            activeUsers.forEach((users, meetingId) => {
                const user = users.find((u) => u.socketId === socket.id);

                if (user) {
                    const updatedUsers = users.filter(
                        (u) => u.socketId !== socket.id
                    );

                    activeUsers.set(meetingId, updatedUsers);

                    io.to(meetingId).emit("participantLeft", {
                        userId: user.userId,
                        participants: updatedUsers,
                    });
                }
            });
        });
    });
};
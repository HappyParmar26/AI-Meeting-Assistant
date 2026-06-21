const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        meetingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meeting",
        },

        type: {
            type: String,
            enum: ["meeting", "action-item", "reminder"],
            default: "reminder",
        },

        actionItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ActionItem",
        },

        message: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["unread", "read"],
            default: "unread",
        },
    },
    {
        timestamps: true,
    }
);
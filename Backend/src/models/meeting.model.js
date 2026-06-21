const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled'],
        }

    },{
        timestamps: true
    }
)

module.exports = mongoose.model('Meeting', meetingSchema)
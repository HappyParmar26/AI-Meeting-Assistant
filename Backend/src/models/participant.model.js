const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({

    role: {
        type: String,
        enum: ["host", "participant"],
        default: "participant"
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    meeting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
        required: true
    },
    joiningTime: {
        type: Date,
        default: Date.now
    },
    leavingTime: {
        type: Date,
        default:null
    }
},
    {
        timestamps: true,
    }    

);

module.exports = mongoose.model('Participant', participantSchema);
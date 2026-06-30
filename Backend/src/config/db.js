const mongoose = require('mongoose');

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-meeting-assistant');
        console.log('Connected to Database');
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
}

module.exports = connectDb;
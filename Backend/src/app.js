const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');
const transcriptRoutes = require('./routes/transcriptRouter');
const meetingRoutes = require('./routes/meetingRouter');
const summaryRoutes = require('./routes/summaryRouter');
const actionRouter = require('./routes/actionRouter');
const recordingRouter = require('./routes/recordingRouter');
const notificationRouter = require('./routes/notificationRouter');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/meeting', meetingRoutes);
app.use('/api/transcript', transcriptRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/action', actionRouter);
app.use('/api/recording', recordingRouter);
app.use('/api/notification', notificationRouter);

module.exports = app;
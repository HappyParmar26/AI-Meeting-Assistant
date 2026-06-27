const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');
const transcriptRoutes = require("./routes/transcript.routes");
const meetingRoutes = require("./routes/meeting.routes");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use("/api/meeting", meetingRoutes);
app.use("/api/transcript", transcriptRoutes);

module.exports = app;
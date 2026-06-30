require('dotenv').config();
const express = require('express');
const http = require('http');
const app = require('./src/app');
const connectDb = require('./src/config/db');
const { Server } = require('socket.io');

connectDb();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

require('./src/socket/meetingSocket')(io);

server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
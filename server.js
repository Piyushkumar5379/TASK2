/**
 * Real-time Chat Server using Express + Socket.IO
 * 
 * To run:
 * 1. npm init -y
 * 2. npm install express socket.io
 * 3. node server.js
 */

// Backend server for real-time chat using Node.js and Socket.IO

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the frontend HTML file
app.use(express.static(path.join(__dirname, 'public')));

const users = {}; // socket.id -> { username, room }

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);

  socket.on('join room', ({ username, room }) => {
    users[socket.id] = { username, room };
    socket.join(room);
    console.log(`${username} joined room: ${room}`);
  });

  socket.on('chat message', ({ text, room }) => {
    const user = users[socket.id];
    if (user && user.room === room) {
      // Only emit to the room
      io.to(room).emit('chat message', { id: socket.id, text, name: user.username });
    }
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    console.log('user disconnected: ' + socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});




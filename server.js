const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./models/Message'); // Make sure the Message model is correctly defined
const app = express();

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect('mongodb://localhost:27017/chatApp').then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// HTTP Server and Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// WebSocket Communication
io.on('connection', (socket) => {
  console.log('A user connected');

  // Fetch previous messages from the database and send them to the new user
  Message.find().sort({ timestamp: 1 }).limit(50) // Fetch last 50 messages
    .then(messages => {
      socket.emit('previousMessages', messages);
    })
    .catch(err => console.error('Error fetching messages:', err));

  // Listen for incoming messages
  socket.on('sendMessage', async (messageData) => {
    try {
      const newMessage = new Message(messageData);
      await newMessage.save(); // Save message to the database
      io.emit('receiveMessage', messageData); // Broadcast message to all clients
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Routes for API (optional, not used in WebSocket but available)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

server.listen(4000, () => console.log('Server running on http://localhost:4000'));

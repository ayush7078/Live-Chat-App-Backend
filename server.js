const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config(); 

const Message = require('./models/Message'); 
const app = express();

// Middleware
app.use(express.json());

// Database Connection using environment variable for MONGO_URI
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// HTTP Server and Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Use environment variable for frontend URL
    methods: ["GET", "POST"],
  },
});

// WebSocket Communication
io.on('connection', (socket) => {
  console.log('A user connected');

  // Fetch previous messages from the database and send them to the new user
  Message.find().sort({ timestamp: 1 }).limit(50)
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

// Routes for API
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
});


const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server running on http://localhost:${port}`));

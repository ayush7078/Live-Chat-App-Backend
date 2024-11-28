const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Get all messages from the database
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Post a new message to the database
router.post('/messages', async (req, res) => {
    const { sender, message, timestamp } = req.body;
    try {
      const newMessage = new Message({ sender, message, timestamp });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
  
module.exports = router;

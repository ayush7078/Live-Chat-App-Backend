## Live Chat Application - Backend
This repository contains the backend for a real-time chat application built with Node.js, Express.js, Socket.IO, and MongoDB.

# Features
1. Real-time messaging with Socket.IO
2. Save messages to MongoDB
3. Fetch previous messages from the database
4. REST API for fetching and posting messages

# Table of Contents
- Installation
- Environment Variables
- API Endpoints
- WebSocket Events
- Running the Application

# Installation
1. Clone the repository
git clone https://github.com/ayush7078/Live-Chat-App-Backend.git
cd Live-Chat-App-Backend
2. Install dependencies
npm install

3. Set up MongoDB
Ensure that you have MongoDB installed and running locally, or you can use a cloud-based MongoDB provider like MongoDB Atlas.

4. Create .env file (optional for custom configurations)
Add the following environment variables to your .env file:
MONGO_URI=mongodb://localhost:27017/chatApp
PORT=4000

# API Endpoints
1. GET /api/messages
Fetch all messages from the database, sorted by timestamp (oldest first).

2. POST /api/messages
Post a new message to the database.

3. WebSocket Events
The backend uses Socket.IO for real-time communication.

# Running the Application
1. Development Mode
To run the application in development mode, run the following command:
npm run dev

This will start the server on port 4000 by default.

2. Production Mode
To run the application in production mode, first build and then run the server:
- Build the application (optional for production):
npm run build

- Start the server:
npm start
import { instrument } from '@socket.io/admin-ui';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { Message } from './model/message.model.js';
import dotenv from 'dotenv';

dotenv.config();
await mongoose.connect(process.env.MONGO_URL);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'https://admin.socket.io'],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.send("Welcome to our application");
});

io.on('connection', (socket) => {
  // Event to create a room with a random Id

  socket.on('create-room', (name)=>{
    const roomId = Math.random().toString(36).substring(2, 9);
    socket.username = name;
    socket.join(roomId);

    console.log(roomId);

    // send the generated Id back to the client
    socket.emit('room-created', {roomId, name});
    console.log(`${socket.id} created room ${roomId}`);
  })
  socket.on('join-room', async (roomId, name) => {
    roomId = String(roomId || "").trim();
    if (!roomId) return;
    
    socket.username = name;
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId}`);
    
    // Send chat history to the joining user
    const history = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .limit(50);
    
    socket.emit("room-history", history);
  });

  socket.on('send-message', async (text, roomId) => {
    roomId = String(roomId || "").trim();
    
    const payload = {
      text,
      sender: socket.username || socket.id,
      roomId,
      createdAt: new Date()
    };

    // Save to database
    await Message.create({
      sender: socket.username,
      text,
      roomId,
      createdAt: new Date()
    });
    
    // Confirm to sender
    socket.emit("message-sent", payload);
    
    // Broadcast to others in room
    if (roomId) socket.to(roomId).emit("message-received", payload);
  });

  socket.on('get-room-history', async (roomId) => {
    const history = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .limit(50);
    socket.emit("room-history", history);
  });
});

const port = 3000;
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});   

instrument(io, { auth: false, mode: 'development'});
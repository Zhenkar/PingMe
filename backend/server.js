const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { protect } = require('./middleware/authMiddleware');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('typing', (data) => {
    socket.to(data.recipient).emit('typing', data);
  });

  socket.on('message', (message) => {
    io.to(message.recipient).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
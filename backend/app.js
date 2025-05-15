const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./logger'); 

const authRoutes = require('./routes/auth');
const submissionRoutes = require('./routes/submissionRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT","DELETE"]
  }
});

app.set('io', io);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => logger.info('✅ MongoDB connected'))
.catch(err => logger.error('❌ MongoDB connection error: %o', err));

app.use('/api', authRoutes);
app.use('/api', submissionRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend API');
});

io.on('connection', (socket) => {
  logger.info('🔌 A user connected: %s', socket.id);

  socket.on('message', (data) => {
    logger.info('📩 Message received: %o', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    logger.info('🔌 User disconnected: %s', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info('🚀 Server running on http://localhost:%d', PORT);
});

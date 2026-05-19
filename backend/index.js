const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDatabase = require('./config/db');

dotenv.config();
connectDatabase();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

app.use(cors());
app.use(express.json()); 

// 4. الربط بالمسارات (التي أرسلتها أنت)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));


// 5. مسار تجريبي بسيط
app.get('/', (req, res) => {
    res.send('HRM System API is running...');
});

// 6. تشغيل السيرفر
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
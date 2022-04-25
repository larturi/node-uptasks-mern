import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

// CORS
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            //for bypassing postman req with  no origin
            return callback(null, true);
        }

        if (whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

// Routing
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.info(`Server running on port ${port}`);
});

// Socket.io
import { Server } from 'socket.io';
const io = new Server(server, {
    pingInterval: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});

io.on('connection', (socket) => {
    console.log('New client connected');
});
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import { PORT, DB_LINK } from './configuration.js';
import userRoutes from './routes/user.routes.js';
import questionRoutes from './routes/question.routes.js'; 
import signRoutes from './routes/sign.routes.js';
import chapterRoutes from './routes/chapter.routes.js';

const app = express();


//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/signs', signRoutes);

// Connect to the database and start the server
mongoose.connect(DB_LINK)
    .then(() => {
        console.log("App is connected to the database");
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
    });

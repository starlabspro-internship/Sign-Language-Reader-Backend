import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import { PORT, DB_LINK } from './configuration.js';
import userRoutes from './routes/user.routes.js';
import questionRoutes from './routes/question.routes.js'; 

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);

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

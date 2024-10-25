import express from 'express';
import mongoose from 'mongoose';
import { PORT, DB_LINK } from './configuration.js';
import userRoutes from './routes/user.routes.js';
import questionRoutes from './routes/question.routes.js';  

import chapterRoutes from './routes/chapter.routes.js';
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/chapters', chapterRoutes);

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

import express from 'express';
import mongoose from 'mongoose';
import { PORT, DB_LINK } from './configuration.js';
import userRoutes from './routes/user.routes.js';
import chapterRoutes from './routes/chapter.routes.js';
const app = express();

// parse json body midelware
app.use(express.json());

// routat
app.use('/api/users', userRoutes);
app.use('/api/chapters', chapterRoutes);

// Connect to MongoDB
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

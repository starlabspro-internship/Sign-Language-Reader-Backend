import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import { PORT, DB_LINK } from './configuration.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);

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

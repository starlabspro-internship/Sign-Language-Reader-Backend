import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT, DB_LINK } from './configuration.js';
import userRoutes from './routes/user.routes.js';
import questionRoutes from './routes/question.routes.js';
import signRoutes from './routes/sign.routes.js';
import chapterRoutes from './routes/chapter.routes.js';
import faqRoutes from './routes/faq.routes.js';
import passwordResetRoutes from './routes/passwordReset.routes.js';
import userPosting from './routes/userPosting.routes.js';

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cookieParser());
app.use(cors({
    origin: ['https://duarte.devops99.pro', 'https://localhost:8080','http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());

// Set the path for the frontend folder
const frontendPath = path.resolve('/var/www/Sign-Language-Reader-Frontend/dist');
app.use(express.static(frontendPath));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/signs', signRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/users', passwordResetRoutes);
app.use('/api/post', userPosting);

// Serve the home.html file on the base URL
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'home.html'));  // Use frontendPath here
});

mongoose.connect(DB_LINK)
    .then(() => {
        console.log("App is connected to the database");

        const httpsOptions = {
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert')
        };

        https.createServer(httpsOptions, app).listen(PORT, () => {
            console.log(`Secure server is running on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
    });

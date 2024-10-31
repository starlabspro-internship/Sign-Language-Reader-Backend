import https from 'https';
import fs from 'fs';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { PORT, DB_LINK } from './configuration.js';
import userRoutes from './routes/user.routes.js';
import questionRoutes from './routes/question.routes.js'; 
import signRoutes from './routes/sign.routes.js';
import chapterRoutes from './routes/chapter.routes.js';
import faqRoutes from './routes/faq.routes.js';

const app = express();

//middlewares
app.use(cookieParser());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Set-Cookie']
  }));  

app.use(express.json());
app.use(express.static('production-front'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/signs', signRoutes);
app.use('/api/faq', faqRoutes);


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

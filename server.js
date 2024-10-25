import express from 'express';
import { PORT, DB_LINK } from './configuration.js';
import mongoose from 'mongoose';
import questionRoutes from './routes/question.routes.js';  


const app = express();


app.use(express.json());


app.use("/api/questions", questionRoutes);

app.get('/', (req, res) => { res.send('Hello, the server is working!'); });


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

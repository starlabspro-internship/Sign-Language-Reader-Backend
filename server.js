import express from 'express';
import { PORT, DB_LINK } from './configuration.js';
import mongoose from 'mongoose';

const app = express();

mongoose.connect(DB_LINK)
    .then(()=>{
        console.log("App is connected to database")
        app.listen(PORT, ()=>{
            console.log(`server is running in port: ${PORT}`)
        })
    })
    
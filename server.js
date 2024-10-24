import express from 'express';
import { PORT } from './configuration.js';

const app = express();

app.listen(PORT, () => {
    console.log(`app is listening in port ${PORT}`);
})
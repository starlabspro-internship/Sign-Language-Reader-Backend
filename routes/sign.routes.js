import express from 'express';
import { createSign, getSigns, updateSign, deleteSign, translateSigns } from '../controllers/sign.controller.js';
import upload from '../middlewares/upload.middleware.js';
import validateImageFormat from '../middlewares/validateImageFormat.middleware.js';
import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', upload.single('signImage'), validateImageFormat, createSign);
router.get('/', getSigns);
router.put('/:id', upload.single('signImage'), validateImageFormat, updateSign);
router.delete('/:id', deleteSign);

router.get('/translate', auth, translateSigns);

export default router;

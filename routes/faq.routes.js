import express from 'express';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../controllers/faq.controller.js';
import auth from '../middleware/auth.middleware.js';


const router = express.Router();

router.get('/', auth, getFaqs);

router.post('/', auth, createFaq);

router.put('/:id', auth, updateFaq);

router.delete('/:id', auth, deleteFaq);


export default router;

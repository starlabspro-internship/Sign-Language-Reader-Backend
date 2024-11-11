import express from 'express';
import { getFaqsPublic, getFaqsAdmin, createFaq, updateFaq, deleteFaq } from '../controllers/faq.controller.js';
import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getFaqsPublic);

router.get('/admin', auth, getFaqsAdmin);

router.post('/', auth, createFaq);
router.put('/:id', auth, updateFaq);
router.delete('/:id', auth, deleteFaq);

export default router;

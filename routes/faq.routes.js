import express from 'express';
import { getFaqs, createFaq } from '../controllers/faq.controller.js';

const router = express.Router();

// Route to get all FAQs
router.get('/', getFaqs);

// Route to create a new FAQ
router.post('/', createFaq);

export default router;

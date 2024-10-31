import express from 'express';
import { getFAQuestions, createFAQuestions } from '../controllers/faq.controller.js';

const router = express.Router();

// Route to get all FAQs
router.get('/', getFAQuestions);

// Route to create a new FAQ
router.post('/', createFAQuestions);

export default router;

import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import {
    createQuestion,
    getQuestions,
    getQuestionsByChapterId,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    submitAnswer
} from '../controllers/question.controller.js';

const router = express.Router();


router.post('/', createQuestion);  

router.get('/', getQuestions);     

router.get('/:id', getQuestionById); 

router.get('/chapter/:chapterId', getQuestionsByChapterId);

router.post('/submit', auth, submitAnswer);

router.put('/:id', updateQuestion); 

router.delete('/:id', deleteQuestion); 

export default router;
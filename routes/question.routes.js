import express from 'express';
import {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} from '../controllers/question.controller.js';

const router = express.Router();


router.post('/', createQuestion);  

router.get('/', getQuestions);     

router.get('/:id', getQuestionById); 

router.put('/:id', updateQuestion); 

router.delete('/:id', deleteQuestion); 

export default router;
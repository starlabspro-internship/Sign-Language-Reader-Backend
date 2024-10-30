import Question from '../models/Question.model.schema.js';
import User from '../models/User.model.schema.js';
import mongoose from 'mongoose';

export const createQuestion = async (req, res) => {
    try {
        const questions = await Question.insertMany(req.body); // Insert an array of questions
        res.status(201).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid question ID format.' });
        }

        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid question ID format.' });
        }

        const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid question ID format.' });
        }

        const question = await Question.findByIdAndDelete(id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const getQuestionsByChapterId = async (req, res) => {
    try {
        const { chapterId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(chapterId)) {
            return res.status(400).json({ message: 'Invalid chapter ID format.' });
        }

        const questions = await Question.find({ chapter: chapterId }).populate('chapter');

        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this chapter.' });
        }

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitAnswer = async (req, res) => {
    try {
        // Get questionId and answer from request body
        const { questionId, answer } = req.body;

        // Verify questionId format
        if (!mongoose.Types.ObjectId.isValid(questionId)) {
            return res.status(400).json({ message: 'Invalid question ID format.' });
        }

        // Retrieve the question
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if the provided answer matches the correct solution
        const correctSolution = question.question_solutions.find(solution => solution.solution_correct === true);
        const isCorrect = correctSolution.solution_text.toLowerCase() === answer.toLowerCase();

        // Store completed question in the logged-in user's profile
        const userId = req.user.id; // Extract user ID from the decoded token via auth middleware
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.userCompleted.push({ question_id: questionId, date_of_completion: new Date() });
        await user.save();

        res.status(200).json({ correct: isCorrect, feedback: isCorrect ? 'Correct answer!' : 'Incorrect answer.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

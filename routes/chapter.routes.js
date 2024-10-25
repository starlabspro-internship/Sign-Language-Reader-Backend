import express from 'express';
import {
    createChapter,
    getChapters,
    getChapterById,
    updateChapter,
    deleteChapter
} from '../controllers/chapter.controller.js';

const router = express.Router();

// POST request to create a new chapter
router.post('/', createChapter);

//GET request tto retrive all chapters
router.get('/', getChapters);

// GET request to retrive a specific chapter by ID
router.get('/:id', getChapterById);

//PUT request to update a specific chapter by ID
router.put('/:id', updateChapter);

// DELETE request to delete a specific chapter by ID
router.delete('/:id', deleteChapter);

export default router;
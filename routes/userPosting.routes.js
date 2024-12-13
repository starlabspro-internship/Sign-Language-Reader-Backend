import express from 'express';
import { createPost, editPost, deletePost, addComment, likePost, likeComment, pinComment, deleteComment, getAllPosts, getSinglePost } from '../controllers/userPosting.controller.js';
import auth from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js'; 
import validateImageFormat from '../middlewares/validateImageFormat.middleware.js'; 

const router = express.Router();

router.post( //tested
    '/create', 
    auth, 
    upload.array('postingImages', 3), 
    validateImageFormat, 
    createPost
);

router.put( //tested
    '/edit/:id', 
    auth, 
    upload.array('postingImages', 3), 
    validateImageFormat, 
    editPost
);
  

router.delete( //tested
    '/delete/:id', 
    auth, 
    deletePost
);

router.post(
    '/:id/comment', //testesd
    auth,  
    addComment
);

router.post('/:id/like', auth, likePost);

router.post('/:postId/comments/:commentId/like', auth, likeComment);

router.put('/:postId/comments/:commentId/pin', auth, pinComment);

router.delete('/:postId/comments/:commentId', auth, deleteComment);

// PA NEVOJE AUTENTIFIKIMI
router.get('/', getAllPosts);

router.get('/:id', getSinglePost);

export default router;

import express from 'express';
import { createPost, editPost, deletePost, addComment, toggleLikePost,
         likeComment, pinComment, deleteComment, getMostRecentPosts, 
         getSinglePost, getMostActivePosts, getMostViewedPosts, 
         getMostLikedPosts, getMostCommentedPosts, getUserPosts, 
         getUserCommentedPosts, getUserLikedPosts } from '../controllers/userPosting.controller.js';
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

router.put('/:id/like', auth, toggleLikePost);

router.put('/:postId/comments/:commentId/like', auth, likeComment);

router.put('/:postId/comments/:commentId/pin', auth, pinComment);

router.delete('/:postId/comments/:commentId', auth, deleteComment);

// PA NEVOJE AUTENTIFIKIMI

router.get('/most-active', getMostActivePosts);

router.get('/most-viewed', getMostViewedPosts);
router.get('/most-liked', getMostLikedPosts);
router.get('/most-commented', getMostCommentedPosts);

router.get('/user-posts', auth, getUserPosts);
router.get('/user-commented', auth, getUserCommentedPosts);
router.get('/user-liked', auth, getUserLikedPosts);

router.get('/all', getMostRecentPosts); //most recen

router.get('/:id', getSinglePost);

export default router;

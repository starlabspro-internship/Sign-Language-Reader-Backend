import cloudinary from 'cloudinary';
import fs from 'fs';
import UserPosting from '../models/UserPosting.model.schema.js'; 
import User from '../models/User.model.schema.js'; 

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../configuration.js';

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

export const createPost = async (req, res) => {
  try {
    const { postingTitle, postingComp } = req.body; 
    const imageFiles = req.files; 

    if (!postingTitle || !postingComp) {
      return res.status(400).json({ message: 'Posting title and composition are required.' });
    }

    let uploadedImageUrls = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const uploadResult = await cloudinary.v2.uploader.upload(file.path, {
          folder: 'user_posts'
        });
        uploadedImageUrls.push(uploadResult.secure_url);

        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    }

    const newPost = new UserPosting({
      postedBy: req.user.id, 
      postingTitle,
      postingComp,
      postingImages: uploadedImageUrls,
      views: 0,
      likes: 0,
      comments: [] 
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully!', post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

export const editPost = async (req, res) => {
try {
    const { postingTitle, postingComp } = req.body;
    const postId = req.params.id; 
    const userId = req.user.id; 

    const post = await UserPosting.findById(postId);
    if (!post) {
    return res.status(404).json({ message: 'Post not found' });
    }

    if (post.postedBy.toString() !== userId && !req.user.userIsAdmin) {
    return res.status(403).json({ message: 'Unauthorized to edit this post' });
    }

    if (postingTitle) post.postingTitle = postingTitle;
    if (postingComp) post.postingComp = postingComp;

    if (req.files && req.files.length > 0) {
    const uploadedImageUrls = [];
    for (const file of req.files) {
        const uploadResult = await cloudinary.v2.uploader.upload(file.path, {
        folder: 'user_posts',
        });
        uploadedImageUrls.push(uploadResult.secure_url);
        fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
        });
    }
    post.postingImages = uploadedImageUrls; 
    }

    await post.save();
    res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error("Error editing post:", error);
        res.status(500).json({ message: 'Error editing post', error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await UserPosting.findById(postId);
        if (!post) {
        return res.status(404).json({ message: 'Post not found' });
        }

        if (post.postedBy.toString() !== userId && !req.user.userIsAdmin) {
        return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        await UserPosting.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};
  
export const addComment = async (req, res) => {
    try {
      const { commentText } = req.body;
      const postId = req.params.id; 
      const userId = req.user.id; 
  
      if (!commentText || commentText.trim() === '') {
        return res.status(400).json({ message: 'Comment text is required' });
      }
  
      const post = await UserPosting.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const newComment = {
        postedBy: userId,
        commentText
      };
  
      post.comments.push(newComment);
      await post.save();
  
      res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

export const toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id; 

    const post = await UserPosting.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userIndex = post.likedBy.findIndex(id => id.toString() === userId);

    if (userIndex !== -1) {
      post.likedBy.splice(userIndex, 1); 
      post.likes -= 1;
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();
    res.status(200).json({ message: 'Post like toggled successfully', likes: post.likes });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};


export const likeComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const post = await UserPosting.findById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(commentId); 
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    const userIndex = comment.commentLikedBy.findIndex(id => id.toString() === userId);

    if (userIndex !== -1) {
        comment.commentLikedBy.splice(userIndex, 1); 
        comment.commentLikes -= 1;
    } else {
        comment.commentLikedBy.push(userId);
        comment.commentLikes += 1;
    }

    await post.save();
    res.status(200).json({ message: 'Comment like toggled successfully', likesCount: comment.commentLikes });
} catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: 'Error toggling like', error: error.message });
}
};
  
export const pinComment = async (req, res) => {
  try {
      const { postId, commentId } = req.params;
      const userId = req.user.id;

      const post = await UserPosting.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      if (post.postedBy.toString() !== userId) {
          return res.status(403).json({ message: 'Only the post creator can pin comments' });
      }

      const comment = post.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
      comment.pinned = !comment.pinned;

      await post.save();

      res.status(200).json({
          message: comment.pinned ? 'Comment pinned successfully' : 'Comment unpinned successfully',
          pinnedComment: comment
      });
  } catch (error) {
      console.error("Error pinning comment:", error);
      res.status(500).json({ message: 'Error pinning comment', error: error.message });
  }
};
  
export const deleteComment = async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const userId = req.user.id;
      const userIsAdmin = req.user.userIsAdmin;
  
      const post = await UserPosting.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      const comment = post.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
  
      if (
        comment.postedBy.toString() !== userId &&
        post.postedBy.toString() !== userId &&
        !userIsAdmin
      ) {
        return res.status(403).json({ message: 'Not authorized to delete this comment' });
      }
  
      comment.deleteOne();
      await post.save();
  
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};

export const getMostActivePosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await UserPosting.find({ postedBy: { $ne: null } })
      .populate('postedBy', 'userName userSurname userpicture');

    const postsWithInteractions = posts.map(post => {
      const totalInteractions = (post.views || 0) * 1 
                              + (post.likes || 0) * 2    
                              + (post.comments?.length || 0) * 3;  
      return { ...post.toObject(), totalInteractions };  
    });
    postsWithInteractions.sort((a, b) => b.totalInteractions - a.totalInteractions);

    const paginatedPosts = postsWithInteractions.slice(offset, offset + limit);

    res.status(200).json(paginatedPosts);
  } catch (error) {
    console.error("Error fetching most active posts:", error);
    res.status(500).json({ message: 'Error fetching active posts', error: error.message });
  }
};

export const getMostRecentPosts = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const posts = await UserPosting.find({ postedBy: { $ne: null } })  
      .populate('postedBy', 'userName userSurname userpicture')  
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ datePosted: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

export const getMostViewedPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await UserPosting.find({ postedBy: { $ne: null } })
      .populate('postedBy', 'userName userSurname userpicture'); 

    const postsWithViewCounts = posts.map(post => {
      const viewCount = post.views || 0;  
      return { ...post.toObject(), viewCount };  
    });

    postsWithViewCounts.sort((a, b) => b.viewCount - a.viewCount);

    const paginatedPosts = postsWithViewCounts.slice(offset, offset + limit);

    res.status(200).json(paginatedPosts);
  } catch (error) {
    console.error("Error fetching most-viewed posts:", error);
    res.status(500).json({ message: 'Error fetching most-viewed posts', error: error.message });
  }
};

export const getMostLikedPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await UserPosting.find({ postedBy: { $ne: null } })
      .populate('postedBy', 'userName userSurname userpicture'); 

    const postsWithLikeCounts = posts.map(post => {
      const likeCount = post.likes || 0;  
      return { ...post.toObject(), likeCount };  
    });

    postsWithLikeCounts.sort((a, b) => b.likeCount - a.likeCount);

    const paginatedPosts = postsWithLikeCounts.slice(offset, offset + limit);

    res.status(200).json(paginatedPosts);
  } catch (error) {
    console.error("Error fetching most-liked posts:", error);
    res.status(500).json({ message: 'Error fetching most-liked posts', error: error.message });
  }
};

export const getMostCommentedPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await UserPosting.find({ postedBy: { $ne: null } })
      .populate('postedBy', 'userName userSurname userpicture'); 

    const postsWithCommentCounts = posts.map(post => {
      const commentCount = post.comments?.length || 0; 
      return { ...post.toObject(), commentCount };
    });

    postsWithCommentCounts.sort((a, b) => b.commentCount - a.commentCount);
    const paginatedPosts = postsWithCommentCounts.slice(offset, offset + limit);
    res.status(200).json(paginatedPosts);
  } catch (error) {
    console.error("Error fetching most-commented posts:", error);
    res.status(500).json({ message: 'Error fetching most-commented posts', error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id; 
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await UserPosting.find({ postedBy: userId })
      .skip(offset)
      .limit(limit)
      .populate('postedBy', 'userName userSurname userpicture');

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: 'Error fetching user posts', error: error.message });
  }
};

export const getUserCommentedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await UserPosting.find({
      'comments.postedBy': { _id: userId }, 
    })
      .skip(offset)
      .limit(limit)
      .populate('postedBy', 'userName userSurname userpicture')
      .populate('comments.postedBy', 'userName userSurname userpicture'); 

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user commented posts:', error);
    res.status(500).json({ message: 'Error fetching user commented posts', error: error.message });
  }
};


export const getUserLikedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await UserPosting.find({ likedBy: userId })
      .skip(offset)
      .limit(limit)
      .populate('postedBy', 'userName userSurname userpicture');

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user liked posts:", error);
    res.status(500).json({ message: 'Error fetching user liked posts', error: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  try {
      const postId = req.params.id;

      const post = await UserPosting.findById(postId)
          .populate('postedBy', 'userName userSurname userpicture') 
          .populate({
              path: 'comments.postedBy',
              select: 'userName userSurname userpicture'
          });

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      post.views += 1;
      await post.save();

      res.status(200).json(post);
  } catch (error) {
      console.error("Error fetching single post:", error);
      res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

  
  
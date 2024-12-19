import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema({
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  dateCommentPosted: { type: Date, default: Date.now }, 
  commentText: { type: String, required: true },
  commentLikes: { type: Number, default: 0 },
  commentLikedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  pinned: { type: Boolean, default: false }
});


const UserPostingSchema = new Schema({
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  datePosted: { type: Date, default: Date.now }, 
  postingTitle: { type: String, required: true }, 
  postingComp: { type: String, required: true }, 
  postingImages: { type: [String], validate: [arrayLimit, 'Exceeds the limit of 3 images'] }, 
  views: { type: Number, default: 0 }, 
  likes: { type: Number, default: 0 }, 
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  comments: [CommentSchema]
});

function arrayLimit(val) {
  return val.length <= 3;
}

const UserPosting = mongoose.model('UserPosting', UserPostingSchema);
export default UserPosting;

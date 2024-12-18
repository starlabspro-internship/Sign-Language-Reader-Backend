import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: { type: String, required: true },
  userpicture: { type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' },
  userSurname: { type: String, required: true },
  useremail: { type: String, required: true, unique: true },
  userphonenum: { type: String },
  userIsAdmin: { type: Boolean, default: false },
  userIsGuest: { type: Boolean, default: false },
  userpassword: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  userCompleted: [{
    question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    date_of_completion: { type: Date, default: Date.now }
  }],
  userTranslations: [{
    phrase: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
});

const User = mongoose.model('User', UserSchema);
export default User;
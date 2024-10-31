import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: { type: String, required: true },
  userpicture: { type: String },
  userSurname: { type: String, required: true },
  useremail: { type: String, required: true, unique: true },
  userphonenum: { type: String },
  userIsAdmin: { type: Boolean, default: false },
  userpassword: { type: String, required: true },
  userCompleted: [{
    question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    date_of_completion: { type: Date, default: Date.now }
  }],
  userTranslations: [{
    phrase: { type: String, required: true },
    translation: [{ word: String, image: String, error: String }],
    date: { type: Date, default: Date.now }
  }]
});

const User = mongoose.model('User', UserSchema);
export default User;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: [true, "Username is required!]"], unique: true },
  userpicture: { type: String },
  usersurname: { type: String },
  useremail: { type: String, required: true, unique: [true, "Email is required!"] },
  userphonenum: { type: String }, 
  userCompleted: [{
    question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: [true," Question ID is required!"] },
    date_of_completion: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', UserSchema);

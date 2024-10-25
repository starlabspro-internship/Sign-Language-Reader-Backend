import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String }, 
    question_image: { type: String },
    chapter: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
    question_solutions: [{
      solution_text: { type: String },
      solution_image: { type: String },
      solution_correct: { type: Boolean, required: true }
    }]
});
  
const Question = mongoose.model('Question', QuestionSchema);
export default Question;
  
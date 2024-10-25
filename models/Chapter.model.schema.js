import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Question from './Question.model.schema.js';

const ChapterSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});
  
const Chapter = mongoose.model('Chapter', ChapterSchema);
export default Chapter;
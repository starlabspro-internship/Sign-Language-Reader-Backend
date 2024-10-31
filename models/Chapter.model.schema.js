import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
    name: { type: String, required: [true, "Name is required!"] },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});
  
const Chapter = mongoose.model('Chapter', ChapterSchema);
export default Chapter;
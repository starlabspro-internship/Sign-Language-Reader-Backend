const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});
  
module.exports = mongoose.model('Chapter', ChapterSchema);
  
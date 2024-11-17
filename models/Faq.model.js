// models/faq.model.js
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: '' },
    showcased: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('FAQ', faqSchema);

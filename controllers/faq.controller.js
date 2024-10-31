import FAQ from '../models/faq.model.js';


export const getFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
  }
};


export const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required.' });
    }

    // Create a new FAQ document
    const faq = new FAQ({ question, answer });

    // Save to the database
    await faq.save();

    res.status(201).json({ message: 'FAQ created successfully.', faq });
  } catch (error) {
    res.status(500).json({ message: 'Error creating FAQ.', error: error.message });
  }
};

import FAQ from '../models/faq.model.js';
import User from '../models/user.model.js'; 

export const getFaqs = async (req, res) => {
  try {
    if (!req.user || !req.user.userIsAdmin) {
      return res.status(403).json({ message: 'You need to be an admin to view all the FAQ-s.' });
    }

    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required.' });
    }

    const faq = new FAQ({ question, answer: '' });

    await faq.save();
    res.status(201).json({ message: 'FAQ created successfully.', faq });
  } catch (error) {
    res.status(500).json({ message: 'Error creating FAQ.', error: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!req.user || !req.user.userIsAdmin) {
      return res.status(403).json({ message: 'You need to be an admin in order to wtrite the answer to the faq.' });
    }

    const faq = await FAQ.findByIdAndUpdate(id, { answer }, { new: true });

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }

    res.status(200).json({ message: 'FAQ updated successfully.', faq });
  } catch (error) {
    res.status(500).json({ message: 'Error updating FAQ.', error: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.userIsAdmin) {
      return res.status(403).json({ message: 'You need to be an admin in order to delete a faq.' });
    }

    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }

    res.status(200).json({ message: 'FAQ deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting FAQ.', error: error.message });
  }
};


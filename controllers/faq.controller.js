import FAQ from '../models/Faq.model.js';
import User from '../models/User.model.schema.js'; 

export const getFaqsPublic = async (req, res) => {
  try {
    const faqs = await FAQ.find({ showcased: true }); 
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching showcased FAQs', error: error.message });
  }
};

export const getFaqsAdmin = async (req, res) => {
  try {
    if (!req.user || !req.user.userIsAdmin) {
      return res.status(403).json({ message: 'You need to be an admin to view all the FAQs.' });
    }

    const faqs = await FAQ.find(); 
    res.status(200).json(faqs);

  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    const { question, answer = '', showcased = false } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required.' });
    }

    if (showcased) {
      const showcasedCount = await FAQ.countDocuments({ showcased: true });
      if (showcasedCount >= 6) {
        return res.status(400).json({ message: 'Only 6 FAQs can be showcased at a time.' });
      }

      if (!req.user || !req.user.userIsAdmin) {
        return res.status(403).json({ message: 'Admin privileges required to showcase FAQs.' });
      }

      if (!answer) {
        return res.status(400).json({ message: 'Showcased FAQs must have an answer.' });
      }
    }

    const faq = new FAQ({ question, answer, showcased });
    await faq.save();

    res.status(201).json({ message: 'FAQ created successfully.', faq });

  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, showcased } = req.body;

    if ((answer || showcased !== undefined) && (!req.user || !req.user.userIsAdmin)) {
      return res.status(403).json({ message: 'Admin privileges required to update answer or showcase status.' });
    }

    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }

    if (showcased) {
      const showcasedCount = await FAQ.countDocuments({ showcased: true });
      if (showcasedCount >= 6) {
        return res.status(400).json({ message: 'Only 6 FAQs can be showcased at a time.' });
      }

      if (!answer && !faq.answer) {
        return res.status(400).json({ message: 'Showcased FAQs must have an answer.' });
      }
    }

    faq.answer = answer !== undefined ? answer : faq.answer;
    faq.showcased = showcased !== undefined ? showcased : faq.showcased;
    await faq.save();

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



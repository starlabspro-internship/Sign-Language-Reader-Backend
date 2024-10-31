import FAQ from '../models/faq.model.js';

export const getFAQuestions = async (req, res) => {
  try {
      const duplicates = await Question.aggregate([
          {
              $group: {
                  _id: { description: "$description" },  // Group by description (add name here if needed)
                  count: { $sum: 1 },
                  questions: { $push: "$$ROOT" }  // Collect all question documents in each duplicate group
              }
          },
          {
              $sort: { count: -1}  // Sort by count in descending order
          },
          {
              $limit: 10  // Limit results to the top 10
          }
      ]);

      // If no duplicates are found, return a message
      if (duplicates.length === 0) {
          return res.status(200).json({message: "No duplicate questions found."});
      }
      return res.status(200).json({ 'questions': duplicates });
          

  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


export const createFAQuestions = async (req, res) => {
  try {
      const questionData = {
          name: req.body.name,
          description: req.body.description,
          question_image: req.body.question_image,
          chapter: req.body.chapter,
          question_solutions: req.body.question_solutions
      };

      // Insert the question document
      const question = await Question.create(questionData); // Insert a single question document
      res.status(201).json(question);
      
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



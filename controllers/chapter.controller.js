import Chapter from '../models/Chapter.model.schema.js';

export const createChapter = async (req, res) => {
    try{
        const{ name, description, questions } = req.body;

        // Checking if chapter name alredy exists (optional but helpful)
        const existingChapter = await Chapter.findOne({name});
        if(existingChapter) {
            return res.status(400).json({ message: "Chapeter with this name alredy exists."});
        }

        // Create a new chapter documnet
        const chapter = new Chapter({ name, description, questions});
        await chapter.save();

        res.status(201).json(chapter);
    } catch(error) {
        res.status(400).json({message: error.message });
    }
};

// Get
export const getChapters = async (req, res) => {
    try {
        const chapters = await Chapter.find().populate('questions');
        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Get by ID
export const getChapterById = async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from request parameters
        const chapter = await Chapter.findById(id).populate('questions'); // Fetch the chapter

        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        res.status(200).json(chapter); // Return the found chapter
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any errors
    }
};

//Update
// Update Chapter
export const updateChapter = async (req, res) => {
    try {
        const { name, description, questions } = req.body;

        // Validate that required fields are provided
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required." });
        }

        // Use findByIdAndUpdate to update the chapter
        const updatedChapter = await Chapter.findByIdAndUpdate(
            req.params.id, 
            { name, description, questions },
            { new: true }
        ).populate('questions'); // Populate questions if needed

        // Check if the chapter was found and updated
        if (!updatedChapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Respond with the updated chapter
        res.status(200).json(updatedChapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Delete
export const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from request parameters

        const deletedChapter = await Chapter.findByIdAndDelete(id);

        if (!deletedChapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


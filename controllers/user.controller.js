import bcrypt from 'bcrypt';
import User from '../models/User.model.schema.js';
import cloudinary from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../configuration.js';

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

// create
export const createUser = async (req, res) => {
  try {
    const { userpassword, useremail, ...otherData } = req.body;

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(userpassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and include at least 1 letter or 1 number."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(useremail)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    const existingUser = await User.findOne({ useremail });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userpassword, salt);

    let profileImageUrl = null;
    if (req.file) {
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'user_profiles'
      });
      profileImageUrl = uploadResult.secure_url;
    }

    const user = new User({ ...otherData, userpassword: hashedPassword, useremail, profileImage: profileImageUrl });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// R
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// R-ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// U
export const updateUser = async (req, res) => {
  try {
    const { userpassword, useremail, ...otherData } = req.body;

    if (userpassword) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(userpassword)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long and include at least 1 letter and 1 number."
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userpassword, salt);
      otherData.userpassword = hashedPassword; 
    }

    if (useremail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(useremail)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      const existingUser = await User.findOne({ useremail });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Email is already in use." });
      }

      otherData.useremail = useremail; 
    }

    let profileImageUrl = null;
    if (req.file) {
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'user_profiles'
      });
      profileImageUrl = uploadResult.secure_url;
      otherData.profileImage = profileImageUrl;
    }

    const user = await User.findByIdAndUpdate(req.params.id, otherData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// D
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserHistory = async (req, res) => {
  try {
      const user = await User.findById(req.user.id)
          .select('userCompleted userTranslations')
          .populate('userCompleted.question_id', 'questionText')
          .exec();

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const history = [
          ...user.userCompleted.map(item => ({
              type: 'question',
              question_id: item.question_id,
              date: item.date_of_completion,
              details: item.question_id?.questionText || 'Question details unavailable' // Adjust as necessary
          })),
          ...user.userTranslations.map(item => ({
              type: 'translation',
              phrase: item.phrase,
              translation: item.translation,
              date: item.date
          }))
      ].sort((a, b) => b.date - a.date);

      res.json(history);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

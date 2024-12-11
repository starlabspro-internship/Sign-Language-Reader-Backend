import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt'; 
import User from '../models/User.model.schema.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// Password Reset Request Route
router.post('/reset-password', async (req, res) => {
  const { useremail  } = req.body;

  try {
    const user = await User.findOne({ useremail: useremail  });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;

    const message = `
      Password Reset Request
      Please click the link below to reset your password:
      ${resetURL}
      This link will expire in 1 hour.
    `;

    await sendEmail({
      to: user.useremail,
      subject: 'Password Reset Request',
      text: message,
    });

    res.status(200).json({ message: 'Reset instructions sent to email.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Try again later.' });
  }
});

// Password Reset Route (GET for displaying form, POST for submitting password reset)
router
  .route('/reset-password/:token')
  .get(async (req, res) => {
    const { token } = req.params;

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }, // Check if the token is expired
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Serve the password reset form page (could be a simple HTML page or a React component)
      res.status(200).send("Password reset form"); // This would be the page rendered for user to input the new password
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while loading the reset page.' });
    }
  })
  .post(async (req, res) => {
    const { userpassword } = req.body;
    const { token } = req.params;

    if (!userpassword) {
      return res.status(400).json({ message: 'Password is required' });
    }

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Update the user's password
      const hashedPassword = await bcrypt.hash(userpassword, 10); // Hash the new password
      user.userpassword = hashedPassword;
      user.resetPasswordToken = undefined; // Clear the token
      user.resetPasswordExpires = undefined; // Clear the expiration

      await user.save();

      res.status(200).json({ message: 'Password has been successfully reset' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while resetting the password.' });
    }
  });



export default router;

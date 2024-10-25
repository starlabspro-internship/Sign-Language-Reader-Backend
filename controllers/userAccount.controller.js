import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.model.schema.js'; 
import config from '../configuration.js'; 

const createSendToken = (user, res) => {
    const payload = { user: { id: user.id } };
  
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '15m' }); // Tokeni kryhet per 15 minuta
  
    const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); 
  
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 
    });
  
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.json({ msg: 'Authentication successful!', userId: user.id });
};
  
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userName, userSurname, useremail, userpassword, userphonenum } = req.body;

  try {
    let user = await User.findOne({ useremail });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ userName, userSurname, useremail, userpassword, userphonenum });

    const salt = await bcrypt.genSalt(10);
    user.userpassword = await bcrypt.hash(userpassword, salt);

    await user.save();

    createSendToken(user, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { useremail, userpassword } = req.body;

  try {
    let user = await User.findOne({ useremail });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(userpassword, user.userpassword);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    createSendToken(user, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Serve error');
  }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({ msg: 'User logged out' });
};  
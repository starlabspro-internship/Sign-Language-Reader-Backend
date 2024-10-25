import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { check } from 'express-validator';
import { signup, login, logout } from '../controllers/userAccount.controller.js';
import auth from '../middlewares/auth.middleware.js';
import config from '../configuration.js'; 

const router = express.Router();

// Create a new user
router.post('/', createUser);

// Get all users
router.get('/', getUsers);

router.get('/me', auth, (req, res) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: 'No token found, User is not logged in' });
    }

    try {
        const user = req.user; 
        res.json({ 
            message: `User info for: ${user.id}`, 
            userId: user.id, 
            token 
        });
    } catch (error) {
        res.status(403).json({ message: 'Failed Token Verificatiom', error });
    }
});

// Get a user by ID
router.get('/:id', getUserById);

// Update a user by ID
router.put('/:id', updateUser);

// Delete a user by ID
router.delete('/:id', deleteUser);

router.post('/signup',
    [
      check('userName', 'Name is required').not().isEmpty(),
      check('userSurname', 'Surname is required').not().isEmpty(),
      check('useremail', 'Please include a valid email').isEmail(),
      check('userpassword', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    ],
    signup
);
  
router.post('/login',
    [
        check('useremail', 'Please include a valid email').isEmail(),
        check('userpassword', 'Password is required').exists(),
    ],
    login
);

router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    console.log("Received refresh token:", req.cookies.refreshToken)
  
    if (!refreshToken) {
      return res.status(401).json({ msg: 'No refresh token, authorization not allowed' });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);

      const payload = { user: { id: decoded.user.id } };
      const newAccessToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '15m' });
  
      res.cookie('token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 // 15 minuta
      });
  
      res.json({ msg: 'Token refreshed' });
    } catch (err) {
        console.error("Error verifying refresh token:", err);
        res.status(403).json({ msg: 'Invalid refresh token' });
    }
});

router.post('/logout', logout);

export default router;

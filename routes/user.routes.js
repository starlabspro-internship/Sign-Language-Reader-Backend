import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUsers, getUserById, updateUser, deleteUser, getUserHistory } from '../controllers/user.controller.js';
import { check } from 'express-validator';
import { signup, login, logout, createAdmin, createGuest, guestLogin } from '../controllers/userAccount.controller.js';
import auth from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import validateImageFormat from '../middlewares/validateImageFormat.middleware.js';
import config from '../configuration.js';

const router = express.Router();

// Create user  
router.post('/', upload.single('profileImage'), validateImageFormat, createUser);

// Get all users
router.get('/', getUsers);

// Get status login
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
        res.status(403).json({ message: 'Failed Token Verification', error });
    }
});

// get user history by id
router.get('/history', auth, getUserHistory);

// Get user by id 
router.get('/:id', getUserById);

// update user by id
// router.put('/:id', upload.single('profileImage'), validateImageFormat, updateUser);
router.put('/:id', updateUser);

// Delete user by id
router.delete('/:id', deleteUser);

// signup
router.post('/signup', [
    check('userName', 'Name is required').not().isEmpty(),
    check('userSurname', 'Surname is required').not().isEmpty(),
    check('useremail', 'Please include a valid email').isEmail(),
    check('userpassword', 'Password must be at least 8 characters long').isLength({ min: 8 }),
], signup);

// admin creation
router.post('/createAdmin', auth, [
    check('userName', 'Name is required').not().isEmpty(),
    check('userSurname', 'Surname is required').not().isEmpty(),
    check('useremail', 'Please include a valid email').isEmail(),
    check('userpassword', 'Password must be at least 8 characters long').isLength({ min: 8 }),
], createAdmin);

router.post('/createGuest', [
    check('userName', 'Name is required').not().isEmpty(),
    check('userSurname', 'Surname is required').not().isEmpty(),
    check('useremail', 'Please include a valid email').isEmail(),
    check('userpassword', 'Password must be at least 8 characters long').isLength({ min: 8 }),
], createGuest)

// login
router.post('/login', [
    check('useremail', 'Please include a valid email').isEmail(),
    check('userpassword', 'Password is required').exists(),
], login);

router.post('/guestLogin', [
    check('useremail', 'Invalid guest email').equals('guest@example.com')
], guestLogin);


// refresh token
router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
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
            maxAge: 15 * 60 * 1000
        });
        res.json({ msg: 'Token refreshed' });
    } catch (err) {
        console.error("Error verifying refresh token:", err);
        res.status(403).json({ msg: 'Invalid refresh token' });
    }
});

// logout
router.post('/logout', logout);

export default router;

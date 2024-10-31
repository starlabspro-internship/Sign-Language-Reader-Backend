import jwt from 'jsonwebtoken';
import config from '../configuration.js';

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Auth Middleware - Token in cookies:", token);

    if (!token) {
      console.log("No token found, authorization denied.");
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log("Error in Auth Middleware:", err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;

import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Middleware to protect routes by verifying JWT authentication token.
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: Token not provided.' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
    }

    req.user = await User.findById(decodedToken.userId).select('-password');

    next();
  } catch (error) {
    console.error('Error in protect middleware:', error);
    return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

// Middleware to check if the user is an admin.
const admin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).json({ message: 'Authorization failed: Not authorized as an admin.' });
  }
  next();
};

// Export both protect and admin middleware
export { protect, admin };

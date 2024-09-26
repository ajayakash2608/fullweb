import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

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

    if (!req.user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    next();
  } catch (error) {
    console.error('Error in protect middleware:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const admin = (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Authorization failed: Not authorized as an admin.' });
    }
    next();
  } catch (error) {
    console.error('Error in admin middleware:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { protect, admin };

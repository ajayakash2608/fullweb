import User from '../models/userModel.js';

// Middleware to protect routes (no JWT verification)
const protect = async (req, res, next) => {
  try {
    // Assuming that user information is directly accessible via req.user
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication failed: User not found.' });
    }

    // Optionally, fetch user details without checking the token
    req.user = await User.findById(req.user._id).select('-password');
    
    next();
  } catch (error) {
    console.error('Error in protect middleware:', error);
    return res.status(401).json({ message: 'Authentication failed: User not found.' });
  }
};

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
  // Ensure the user is defined and is an admin
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).json({ message: 'Authorization failed: Not authorized as an admin.' });
  }
  next();
};

// Export both protect and admin middleware
export { protect, admin };

import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Ensure this is the correct path to your User model

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(errorHandler(401, "Unauthorized: No token provided"));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(errorHandler(403, "Forbidden: Invalid token"));
    }

    // Find the user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user details to req.user
    req.user = { id: user.id, user_type: user.user_type };
    next();
  } catch (err) {
    console.error("Error in verifyToken middleware:", err);
    return next(errorHandler(500, "Internal Server Error"));
  }
};
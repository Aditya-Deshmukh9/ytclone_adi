import jwt from 'jsonwebtoken'; // Import your User model
import User from '../models/user.Schema.js';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../constants.js';

export const authMiddleware = async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  // Extract token from header
  const refreshToken =
    req.cookies?.refreshToken ||
    req.header('Authorization')?.replace('Bearer ', '');
  // Extract token from header

  if (!accessToken || !refreshToken) {
    return res.status(401).json({
      message: 'No token provided. Unauthorized!',
      success: false,
    });
  }

  try {
    const decodedAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET); // Verify and decode the token

    const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET); // Verify and decode the token

    if (decodedRefreshToken._id != decodedAccessToken._id) {
      return res.status(404).json({
        success: false,
        message: 'Invalid User',
      });
    }

    const user = await User.findById(decodedAccessToken._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      return res.status(404).json({
        message: 'Invalid Access Token',
        success: false,
      });
    }

    req.user = user; // Attach user to the request object
    next(); // Move to the next middleware/controller
  } catch (error) {
    res.status(401).json({
      message: 'Invalid token',
      success: false,
    });
  }
};

export default authMiddleware;

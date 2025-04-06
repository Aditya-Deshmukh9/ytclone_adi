import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/auth.controller.js';
import { validateFields } from '../middlewares/validateField.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/login').post(
  validateFields(['username', 'email', 'password']),

  loginUser
);

router
  .route('/register')
  .post(
    upload.single('avatar'),
    validateFields(['username', 'email', 'password']),
    registerUser
  );

router.route('/logout').post(authMiddleware, logoutUser);

export default router;

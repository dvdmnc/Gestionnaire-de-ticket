import express, { Request, Response, NextFunction } from 'express';
import AuthController from '../controllers/authController';

const router = express.Router();

// Wrapper function to handle async errors properly
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => 
        fn(req, res, next).catch(next);

// Use asyncHandler to handle async controller functions
router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.get('/user', asyncHandler(AuthController.getUser));
router.post('/logout', asyncHandler(AuthController.logout));

export default router;
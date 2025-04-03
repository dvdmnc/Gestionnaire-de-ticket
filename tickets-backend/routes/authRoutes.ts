import express, { Request, Response, NextFunction } from 'express';
import AuthController from '../controllers/authController';

const router = express.Router();


const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => 
        fn(req, res, next).catch(next);


router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.get('/user', asyncHandler(AuthController.getUser));
router.post('/logout', asyncHandler(AuthController.logout));
router.post('/reset-password', asyncHandler(AuthController.resetPassword));

export default router;
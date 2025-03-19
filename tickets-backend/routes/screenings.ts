import { Router } from 'express';
import {
  getScreenings,
  getScreeningById,
  createScreening,
  updateScreening,
  deleteScreening
} from '../controllers/screeningsController';
import { supabaseAuthMiddleware } from "../middleware/supabaseAuthMiddleware"; // Use Supabase auth middleware

const router = Router();

router.get('/', getScreenings);
router.get('/:id', getScreeningById);
router.post('/',supabaseAuthMiddleware, createScreening);
router.put('/:id',supabaseAuthMiddleware, updateScreening);
router.delete('/:id',supabaseAuthMiddleware, deleteScreening);

export default router;

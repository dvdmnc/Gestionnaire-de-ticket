import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomsController';
import { supabaseAuthMiddleware } from "../middleware/supabaseAuthMiddleware"; // Use Supabase auth middleware

const router = Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/',supabaseAuthMiddleware, createRoom);
router.put('/:id',supabaseAuthMiddleware, updateRoom);
router.delete('/:id',supabaseAuthMiddleware, deleteRoom);

export default router;

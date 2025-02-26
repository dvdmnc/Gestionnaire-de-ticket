import { Router } from 'express';
import {
  getScreenings,
  getScreeningById,
  createScreening,
  updateScreening,
  deleteScreening
} from '../controllers/screeningsController';

const router = Router();

router.get('/', getScreenings);
router.get('/:id', getScreeningById);
router.post('/', createScreening);
router.put('/:id', updateScreening);
router.delete('/:id', deleteScreening);

export default router;

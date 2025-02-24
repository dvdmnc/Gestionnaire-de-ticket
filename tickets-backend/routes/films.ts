import { Router } from 'express';
import {
  getFilms,
  getFilmById,
  createFilm,
  updateFilm,
  deleteFilm
} from '../controllers/filmsController';

const router = Router();

router.get('/', getFilms);
router.get('/:id', getFilmById);
router.post('/', createFilm);
router.put('/:id', updateFilm);
router.delete('/:id', deleteFilm);

export default router;

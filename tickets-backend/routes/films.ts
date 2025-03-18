import { Router } from "express";
import {
  getFilms,
  getFilmById,
  createFilm,
  updateFilm,
  deleteFilm,
} from "../controllers/filmsController";
import { supabaseAuthMiddleware } from "../middleware/supabaseAuthMiddleware"; // Use Supabase auth middleware

const router = Router();

router.get("/", getFilms);
router.get("/:id", getFilmById);
router.post("/", supabaseAuthMiddleware, createFilm);
router.put("/:id", supabaseAuthMiddleware,updateFilm);
router.delete("/:id",supabaseAuthMiddleware, deleteFilm);

export default router;

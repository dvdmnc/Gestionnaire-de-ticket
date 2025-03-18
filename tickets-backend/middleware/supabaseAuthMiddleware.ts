import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/types";
import {supabase} from '../db/db';  // Import the existing client

export const supabaseAuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.auth = { user: data.user };
    next();
  } catch (error) {
    next(error);
  }
};
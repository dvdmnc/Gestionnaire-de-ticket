import { Request } from "express";
import { User } from "@supabase/supabase-js"; // Import User type from Supabase

// Extend Express Request type
export interface AuthenticatedRequest extends Request {
  auth?: {
    user: User;
  };
}

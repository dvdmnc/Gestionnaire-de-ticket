import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

class AuthController {
  
  // 🔹 User Registration
  static async register(req: Request, res: Response) {
    const { email, password, nom } = req.body;

    console.log("📩 Incoming Request:", { email, password, nom });

    try {
        // 🔹 Register user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            console.error("❌ Supabase Auth Error:", error.message);
            return res.status(400).json({ error: error.message });
        }

        // 🔹 Get the Supabase User ID
        const userId = data.user?.id;
        if (!userId) {
            return res.status(500).json({ error: "Failed to get user ID from Supabase" });
        }

        // 🔹 Insert user into the `users` table with the same ID from Auth
        const { data: insertedUser, error: dbError } = await supabase
            .from("users")
            .insert([{ 
                id: userId,  // Using the same ID from Auth
                email, 
                nom, 
                created_at: new Date() 
            }])
            .select();

        if (dbError) {
            console.error("❌ Supabase DB Error:", dbError.message);
            
            // 🔹 If insertion fails, attempt to delete the auth user to maintain consistency
            await supabase.auth.admin.deleteUser(userId);
            
            return res.status(400).json({ error: "Failed to save user in database" });
        }

        console.log("✅ User Registered & Saved in DB:", userId);
        return res.json({ 
            message: "User registered successfully!", 
            user: { id: userId, email, nom }
        });
    
    } catch (err) {
        console.error("❌ Fetch Failed Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


  // 🔹 User Login
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) return res.status(401).json({ error: error.message });

      return res.json({ message: 'Login successful!', token: data.session?.access_token });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // 🔹 Get Logged-in User (Requires Token)
  static async getUser(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token missing' });

    try {
      const { data, error } = await supabase.auth.getUser(token);

      if (error) return res.status(401).json({ error: error.message });

      return res.json({ user: data.user });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // 🔹 Logout
  static async logout(req: Request, res: Response) {
    try {
      await supabase.auth.signOut();
      return res.json({ message: 'Logged out successfully!' });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AuthController;
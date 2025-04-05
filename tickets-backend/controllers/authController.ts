import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

class AuthController {
  

  static async register(req: Request, res: Response) {
    const { email, password, nom } = req.body;


    try {

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            return res.status(400).json({ error: error.message });
        }


        const userId = data.user?.id;
        if (!userId) {
            return res.status(500).json({ error: "Failed to get user ID from Supabase" });
        }

  
        const { data: insertedUser, error: dbError } = await supabase
            .from("users")
            .insert([{ 
                id: userId, 
                email, 
                nom, 
                created_at: new Date() 
            }])
            .select();

        if (dbError) {
            

            await supabase.auth.admin.deleteUser(userId);
            
            return res.status(400).json({ error: "Failed to save user in database" });
        }

        return res.json({ 
            message: "User registered successfully!", 
            user: { id: userId, email, nom }
        });
    
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}



  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) return res.status(401).json({ error: error.message });

      const { data: userData, error: userError } = await supabase //Because isAdmin is not returned by the signInWithPassword method so we have to look up the user this way
        .from("users")
        .select("isAdmin")
        .eq("id", data.user.id)
        .single();

        if (userError){
          res.status(500).json({ error: "Internal Server Error" });
        }

      return res.json({ message: 'Login successful!', token: data.session?.access_token, isAdmin:userData?.isAdmin });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

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

  static async logout(req: Request, res: Response) {
    try {
      await supabase.auth.signOut();
      return res.json({ message: 'Logged out successfully!' });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/update-password',
      });
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      return res.json({ message: 'Password reset link sent. Check your email.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to send reset link' });
    }
  };
}

export default AuthController;
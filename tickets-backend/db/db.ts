require('dotenv').config();
import { createClient } from '@supabase/supabase-js'

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY ? "Loaded" : "Not Loaded");

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey)


export const supabase = createClient(supabaseUrl, supabaseKey);

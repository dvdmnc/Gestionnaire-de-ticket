require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY ? "Loaded" : "Not Loaded");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL or SUPABASE_KEY is missing. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

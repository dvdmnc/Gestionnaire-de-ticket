require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const supabase = createClient(supabaseUrl, supabaseKey);

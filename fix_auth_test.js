const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rsfdfagvoagmrfppkbtn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZmRmYWd2b2FnbXJmcHBrYnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMjI0ODEsImV4cCI6MjA1NTU5ODQ4MX0.O1g_J2wP_jJ1w_8oQ8_WqgR9Sj8_VjW_w_Q_9w_0_98';

console.log("Reading env from .env.local if available");

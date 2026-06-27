import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ndrtrtdqtqconsoickbk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcnRydGRxdHFjb25zb2lja2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MjY2NDYsImV4cCI6MjA5NzQwMjY0Nn0.yT8BJZIbvjSpOayOFaOQP5nTGAhFy_9EbzgThR-Q3NI";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
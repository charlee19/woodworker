import { createClient } from "@supabase/supabase-js";
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ndrtrtdqtqconsoickbk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcnRydGRxdHFjb25zb2lja2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MjY2NDYsImV4cCI6MjA5NzQwMjY0Nn0.yT8BJZIbvjSpOayOFaOQP5nTGAhFy_9EbzgThR-Q3NI";

// Sanitize the URL by removing any trailing "/rest/v1/" or "/rest/v1" or trailing slashes
// This ensures Supabase Auth endpoints like /auth/v1 resolve correctly
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

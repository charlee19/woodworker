import { createClient } from "@supabase/supabase-js";
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://reqowcqazzhwoeqowhku.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlcW93Y3Fhenpod29lcW93aGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1OTExNzIsImV4cCI6MjA5ODE2NzE3Mn0.AtD_NDqlMaWolPmzkcgrVf7dGJ8U0FmK0rIyMk255KA";

// Sanitize the URL by removing any trailing "/rest/v1/" or "/rest/v1" or trailing slashes
// This ensures Supabase Auth endpoints like /auth/v1 resolve correctly
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';

// Supabase Project URL
const supabaseUrl = 'https://npxemxaixfdagdpnqsxp.supabase.co';
// Supabase Anon Key (Public Key)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weGVteGFpeGZkYWdkcG5xc3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzA2NTQsImV4cCI6MjA2MDY0NjY1NH0.DEKTZyGySPw2HrjbdsI-lfWKJlL8hLcJWJY1C1LNZ3A';

// IMPORTANT: It is strongly recommended to move these values into environment variables
// (e.g., process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
// for better security and configuration management.
// Make sure NEXT_PUBLIC_ prefix is used for client-side access in Next.js.

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Export the bucket name if you want to reference it centrally
export const BUCKET_NAME = 'product-images'; 
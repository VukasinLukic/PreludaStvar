import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are loaded (especially in non-Next.js environments like scripts)
// In Next.js pages/app router, this happens automatically.
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });
  } catch (err) {
    console.warn('dotenv config load failed (this is expected in production/browser):', err);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Supabase URL (NEXT_PUBLIC_SUPABASE_URL) is missing from environment variables.');
}
if (!supabaseAnonKey) {
  throw new Error('Supabase Anon Key (NEXT_PUBLIC_SUPABASE_ANON_KEY) is missing from environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Simple check to prevent crash if URL is clearly dummy
export const isConfigured = supabaseUrl !== 'https://your-project.supabase.co' && !supabaseUrl.includes('your-project')

export const supabase = createClient(
    isConfigured ? supabaseUrl : 'https://dummy-url-to-prevent-crash.supabase.co',
    supabaseAnonKey
)

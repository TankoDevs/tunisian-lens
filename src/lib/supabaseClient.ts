import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Configured only when both env vars are present and look valid
export const isConfigured =
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co') &&
    supabaseAnonKey.length > 10

let _supabase: SupabaseClient | null = null

if (isConfigured) {
    try {
        _supabase = createClient(supabaseUrl, supabaseAnonKey)
    } catch (e) {
        console.warn('Supabase client failed to initialize:', e)
        _supabase = null
    }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const supabase = _supabase!

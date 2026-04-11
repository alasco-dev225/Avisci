import { createClient } from '@supabase/supabase-js'

// Affiche les variables pour déboguer (à supprimer après)
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables Supabase sont manquantes. Vérifie ton fichier .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
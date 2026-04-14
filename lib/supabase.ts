<<<<<<< HEAD
import { createBrowserClient } from '@supabase/ssr'
=======
import { createClient } from '@supabase/supabase-js'
>>>>>>> f25045625ab8f4f9a637abe358a588b92abf08a9

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variables Supabase manquantes: NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

<<<<<<< HEAD
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()
=======
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
>>>>>>> f25045625ab8f4f9a637abe358a588b92abf08a9

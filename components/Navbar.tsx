'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string, user_metadata?: { nom?: string } } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
  }, [])

  async function deconnexion() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav style={{ backgroundColor: '#1a7a3c' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div style={{ backgroundColor: '#c9a832' }} className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm">
              A
            </div>
            <span className="font-bold text-xl text-white tracking-wide">AvisCI</span>
            <span style={{ color: '#c9a832' }} className="text-xs font-medium hidden md:block">
              Côte d'Ivoire
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-green-100 hover:text-white text-sm transition">
              Accueil
            </Link>
            <Link
              href="/ajouter"
              style={{ backgroundColor: '#c9a832', color: '#1a1a1a' }}
              className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
            >
              + Ajouter une entreprise
            </Link>
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-green-100 text-sm">
                  👤 {user.user_metadata?.nom || user.email}
                </span>
                <button
                  onClick={deconnexion}
                  className="text-red-300 hover:text-red-100 text-sm transition"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-white border border-green-400 px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-2 border-t border-green-600 pt-3">
            <Link href="/" className="block text-green-100 py-2">Accueil</Link>
            <Link href="/ajouter" style={{ color: '#c9a832' }} className="block py-2 font-semibold">
              + Ajouter une entreprise
            </Link>
            {user ? (
              <>
                <span className="block text-green-100 text-sm py-2">👤 {user.user_metadata?.nom || user.email}</span>
                <button onClick={deconnexion} className="block text-red-300 py-2 text-sm">Déconnexion</button>
              </>
            ) : (
              <Link href="/auth" className="block text-white py-2">Connexion</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
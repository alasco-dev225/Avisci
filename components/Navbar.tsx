'use client'
import Link from "next/link";
import Image from "next/image";
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
    <nav style={{ backgroundColor: '#ECF8F6' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-1">
        <div className="flex justify-between items-center">

          {/* LOGO */}
          <Link href="/">
            <Image
              src="/logo.png"
              alt="AvisCI"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" style={{ color: '#212E53' }} className="hover:opacity-70 text-sm font-medium transition">
              Accueil
            </Link>
            <Link href="/stats" style={{ color: '#212E53' }} className="hover:opacity-70 text-sm font-medium transition">
              Statistiques
            </Link>
            <Link href="/ajouter" style={{ backgroundColor: '#212E53', color: '#ECF8F6' }} className="px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition">
              + Ajouter une entreprise
            </Link>
            {user ? (
              <div className="flex items-center space-x-3">
                <span style={{ color: '#212E53' }} className="text-sm font-medium">
                  {user.user_metadata?.nom || user.email}
                </span>
                <button onClick={deconnexion} className="text-red-400 hover:text-red-600 text-sm transition">
                  Deconnexion
                </button>
              </div>
            ) : (
              <Link href="/auth" style={{ color: '#212E53', borderColor: '#212E53' }} className="border px-4 py-2 rounded-lg text-sm font-medium hover:opacity-70 transition">
                Connexion
              </Link>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: '#212E53' }} className="md:hidden text-2xl font-bold">
            {menuOpen ? 'X' : '='}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden mt-2 pb-3 space-y-2 border-t pt-3" style={{ borderColor: '#212E53' }}>
            <Link href="/" style={{ color: '#212E53' }} className="block py-2 text-sm font-medium">Accueil</Link>
            <Link href="/stats" style={{ color: '#212E53' }} className="block py-2 text-sm font-medium">Statistiques</Link>
            <Link href="/ajouter" style={{ color: '#212E53' }} className="block py-2 text-sm font-semibold">
              + Ajouter une entreprise
            </Link>
            {user ? (
              <div>
                <span style={{ color: '#212E53' }} className="block text-sm py-2">{user.user_metadata?.nom || user.email}</span>
                <button onClick={deconnexion} className="block text-red-400 py-2 text-sm">Deconnexion</button>
              </div>
            ) : (
              <Link href="/auth" style={{ color: '#212E53' }} className="block py-2 text-sm font-medium">Connexion</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
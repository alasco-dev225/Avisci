'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/auth');
    router.refresh();
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              🇨🇮
            </div>
            <div>
              <span className="font-bold text-2xl text-[#212E53]">Avis</span>
              <span className="font-bold text-2xl text-orange-600">CI</span>
            </div>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-8 text-[#212E53]">
            <Link href="/" className="hover:text-orange-600 transition">Accueil</Link>
            <Link href="/stats" className="hover:text-orange-600 transition">Statistiques</Link>
            <Link href="/carte" className="hover:text-orange-600 transition">🗺️ Carte</Link>
            <Link href="/entreprises" className="hover:text-orange-600 transition">Entreprises</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/ajouter"
              className="hidden md:block bg-orange-600 text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-orange-700 transition"
            >
              + Ajouter une entreprise
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profil"
                  className="flex items-center gap-2 text-[#212E53] hover:text-orange-600 transition"
                >
                  👤 {user.user_metadata?.nom || 'Mon profil'}
                </Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
              href="/auth"
              className="bg-[#212E53] text-white px-6 py-2.5 rounded-2xl font-medium hover:bg-black transition"
              >
              Connexion
             </Link>
            )}

            {/* Bouton Menu Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-3xl text-[#212E53]"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="md:hidden py-6 border-t bg-white">
            <div className="flex flex-col gap-4 text-[#212E53]">
              <Link href="/" className="py-2 hover:text-orange-600">Accueil</Link>
              <Link href="/stats" className="py-2 hover:text-orange-600">Statistiques</Link>
              <Link href="/carte" className="py-2 hover:text-orange-600">🗺️ Carte</Link>
              <Link href="/entreprises" className="py-2 hover:text-orange-600">Entreprises</Link>
              
              <Link
                href="/ajouter"
                className="mt-4 bg-orange-600 text-white py-3 rounded-2xl text-center font-medium"
              >
                + Ajouter une entreprise
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

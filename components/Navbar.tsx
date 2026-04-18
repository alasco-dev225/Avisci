'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface NavbarProps {
  user: User | null;
}

const liens = [
  { label: 'Accueil', href: '/' },
  { label: 'Statistiques', href: '/stats' },
  { label: '🗺️ Carte', href: '/carte' },
  { label: 'Entreprises', href: '/entreprises' },
  { label: '💬 Communauté', href: '/communaute' },
];

export default function Navbar({ user }: NavbarProps) {
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

          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-8 text-[#212E53]">
            {liens.map((lien) => (
              <Link
                key={lien.href}
                href={lien.href}
                className="text-sm font-medium hover:text-orange-600 transition-colors"
              >
                {lien.label}
              </Link>
            ))}
          </div>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl"
            >
              <Link href="/ajouter">+ Ajouter une entreprise</Link>
            </Button>

            {user ? (
              <>
                <Button asChild variant="ghost" className="text-[#212E53] hover:text-orange-600">
                  <Link href="/profil">
                    👤 {user.user_metadata?.nom || 'Mon profil'}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="bg-[#212E53] hover:bg-black text-white rounded-2xl"
              >
                <Link href="/auth">Connexion</Link>
              </Button>
            )}
          </div>

          {/* Bouton burger mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-[#212E53]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
                <div className="flex flex-col gap-2 mt-8">

                  {/* Liens */}
                  {liens.map((lien) => (
                    <Link
                      key={lien.href}
                      href={lien.href}
                      className="text-[#212E53] text-base font-medium py-3 px-3 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {lien.label}
                    </Link>
                  ))}

                  <div className="border-t my-3" />

                  {/* CTA Ajouter */}
                  <Button
                    asChild
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl w-full"
                  >
                    <Link href="/ajouter">+ Ajouter une entreprise</Link>
                  </Button>

                  {/* Auth */}
                  {user ? (
                    <>
                      <Button asChild variant="outline" className="rounded-2xl w-full">
                        <Link href="/profil">
                          👤 {user.user_metadata?.nom || 'Mon profil'}
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700 w-full rounded-2xl"
                      >
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <Button
                      asChild
                      className="bg-[#212E53] hover:bg-black text-white rounded-2xl w-full"
                    >
                      <Link href="/auth">Connexion</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </nav>
  );
}
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: '#0a1628' }}>

      {/* Corps principal */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Colonne 1 — Logo + description */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/logo.png"
                alt="AvisCI"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <span className="font-bold text-2xl text-white">Avis</span>
                <span className="font-bold text-2xl text-orange-500">CI</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-6 max-w-md" style={{ color: '#aab4c8' }}>
              Trouvez et partagez les meilleures expériences locales en Côte d&apos;Ivoire. 
              Avis vérifiés, entreprises proches de chez vous.
            </p>

            <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs px-4 py-1">
              🔒 Avis 100% vérifiés
            </Badge>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-[#F5CB5C]">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', href: '/' },
                { label: 'Entreprises', href: '/entreprises' },
                { label: 'Carte', href: '/carte' },
                { label: 'Ajouter une entreprise', href: '/ajouter' },
              ].map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    className="text-sm transition-colors hover:text-white block"
                    style={{ color: '#aab4c8' }}
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* À propos */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-[#F5CB5C]">
              À propos
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Notre mission', href: '/a-propos' },
                { label: 'Comment ça marche', href: '/a-propos' },
                { label: 'Contact', href: '/contact' },
                { label: 'Politique de confidentialité', href: '/confidentialite' },
                { label: 'Conditions d\'utilisation', href: '/conditions' },
              ].map((lien) => (
                <li key={lien.label}>
                  <Link
                    href={lien.href}
                    className="text-sm transition-colors hover:text-white block"
                    style={{ color: '#aab4c8' }}
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Réseaux */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-[#F5CB5C]">
              Nous contacter
            </h3>

            <ul className="space-y-4 mb-8">
              <li>
                <a
                  href="mailto:avisci225@hotmail.com"
                  className="flex items-center gap-3 text-sm hover:text-white transition-colors group"
                  style={{ color: '#aab4c8' }}
                >
                  <Mail className="h-5 w-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  avisci225@hotmail.com
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/2250711260591"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-white transition-colors group"
                  style={{ color: '#aab4c8' }}
                >
                  <Phone className="h-5 w-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  +225 07 11 26 05 91
                </a>
              </li>

              <li className="flex items-start gap-3 text-sm" style={{ color: '#aab4c8' }}>
                <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                Abidjan, Côte d&apos;Ivoire
              </li>
            </ul>

            {/* Réseaux sociaux */}
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-[#F5CB5C]">
              Suivez-nous
            </h3>
            <div className="flex gap-3">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/avisci225/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-all"
                style={{ backgroundColor: '#1877F2' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/2250711260591"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-all"
                style={{ backgroundColor: '#25D366' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <Separator className="bg-[#2e3d6b]" />
      <div className="max-w-6xl mx-auto px-6 py-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs" style={{ color: '#aab4c8' }}>
          <p>© {new Date().getFullYear()} AvisCI — Tous droits réservés</p>
          <p className="flex items-center gap-1">
            Fait avec ❤️ en <span className="text-orange-400 font-medium">Côte d&apos;Ivoire</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
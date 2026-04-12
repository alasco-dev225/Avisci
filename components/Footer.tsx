import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#212E53' }} className="text-white mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Logo + description */}
          <div>
            <Image
              src="/logo.png"
              alt="AvisCI"
              width={130}
              height={45}
              className="object-contain mb-4"
            />
            <p className="text-sm" style={{ color: '#aab4c8' }}>
              La plateforme d'avis de confiance en Côte d'Ivoire 🇨🇮
            </p>
          </div>

          {/* Liens */}
          <div>
            <h3 className="font-bold text-base mb-4" style={{ color: '#F5CB5C' }}>Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/a-propos" className="text-sm hover:text-white transition" style={{ color: '#aab4c8' }}>
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition" style={{ color: '#aab4c8' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="font-bold text-base mb-4" style={{ color: '#F5CB5C' }}>Suivez-nous</h3>
            <div className="flex gap-4">

              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition"
                style={{ backgroundColor: '#1877F2' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition"
                style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="white"/>
                </svg>
              </a>

              {/* TikTok */}
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition"
                style={{ backgroundColor: '#010101' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>

            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div style={{ borderTop: '1px solid #2e3d6b' }} className="pt-6 text-center">
          <p className="text-xs" style={{ color: '#aab4c8' }}>
            © {new Date().getFullYear()} AvisCI — Tous droits réservés
          </p>
        </div>

      </div>
    </footer>
  )
}
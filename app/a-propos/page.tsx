export default function APropos() {
  return (
    <div style={{ backgroundColor: '#ffffff' }} className="min-h-screen">

      {/* Hero */}
      <div style={{ backgroundColor: '#212E53' }} className="py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">À propos de AvisCI</h1>
        <p style={{ color: '#aab4c8' }} className="text-lg max-w-2xl mx-auto px-4">
          La plateforme d'avis de confiance en Côte d'Ivoire 🇨🇮
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* Présentation */}
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#212E53' }}>
            🌍 Qui sommes-nous ?
          </h2>
          <p className="text-gray-700 leading-relaxed text-base">
            AvisCI est la première plateforme ivoirienne dédiée aux avis clients. 
            Nous permettons aux consommateurs de Côte d'Ivoire de partager leurs 
            expériences avec les entreprises locales, et d'aider les autres à faire 
            les meilleurs choix au quotidien.
          </p>
        </section>

        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#212E53' }}>
            🎯 Notre mission
          </h2>
          <p className="text-gray-700 leading-relaxed text-base mb-8">
            Rendre transparente la relation entre les entreprises et leurs clients 
            en Côte d'Ivoire, en donnant la parole aux consommateurs.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⭐', titre: 'Avis authentiques', desc: 'Tous les avis sont vérifiés et proviennent de vrais clients.' },
              { icon: '🔍', titre: 'Transparence', desc: 'Nous affichons les bons comme les mauvais avis pour une information honnête.' },
              { icon: '🤝', titre: 'Confiance', desc: 'Nous mettons en relation clients et entreprises de manière fiable.' },
            ].map((item) => (
              <div key={item.titre} className="rounded-xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: '#212E53' }}>{item.titre}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Valeurs */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#212E53' }}>
            💛 Nos valeurs
          </h2>
          <div className="space-y-4">
            {[
              { valeur: 'Honnêteté', desc: 'Nous croyons en une information vraie et non biaisée.' },
              { valeur: 'Accessibilité', desc: 'Notre plateforme est gratuite pour tous les utilisateurs.' },
              { valeur: 'Communauté', desc: 'Nous construisons ensemble une Côte d\'Ivoire mieux informée.' },
              { valeur: 'Innovation', desc: 'Nous améliorons continuellement notre plateforme pour mieux vous servir.' },
            ].map((item) => (
              <div key={item.valeur} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 shadow-sm">
                <div style={{ backgroundColor: '#F5CB5C' }} className="w-3 h-3 rounded-full mt-1.5 shrink-0" />
                <div>
                  <h3 className="font-bold" style={{ color: '#212E53' }}>{item.valeur}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Équipe */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#212E53' }}>
            👥 L'équipe
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { nom: 'Fondateur', role: 'CEO & Co-fondateur', initiale: 'F' },
              { nom: 'Développeur', role: 'Lead Developer', initiale: 'D' },
              { nom: 'Community', role: 'Community Manager', initiale: 'C' },
            ].map((membre) => (
              <div key={membre.nom} className="text-center p-6 rounded-xl border border-gray-100 shadow-sm">
                <div
                  style={{ backgroundColor: '#212E53', color: 'white' }}
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4"
                >
                  {membre.initiale}
                </div>
                <h3 className="font-bold" style={{ color: '#212E53' }}>{membre.nom}</h3>
                <p className="text-sm text-gray-500">{membre.role}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
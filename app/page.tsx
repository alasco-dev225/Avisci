'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Entreprise = {
  id: string
  nom: string
  secteur: string
  description: string
  ville: string
  note_moyenne: number
  total_avis: number
}

const SECTEURS = [
  'Tous', 'Télécoms', 'Banque', 'E-commerce', 'Restauration',
  'Santé', 'Éducation', 'Transport', 'Immobilier',
  'Médias', 'Assurance', 'Commerce', 'Services', 'Autre'
]

const VILLES = [
  'Toutes', 'Abidjan', 'Bouaké', 'Daloa', 'San-Pédro',
  'Yamoussoukro', 'Korhogo', 'Man', 'Gagnoa'
]

function EtoilesNote({ note }: { note: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(note) ? '#F5CB5C' : '#d1d5db' }}>★</span>
      ))}
    </div>
  )
}

export default function Home() {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [secteur, setSecteur] = useState('Tous')
  const [ville, setVille] = useState('Toutes')

  useEffect(() => {
    fetchEntreprises()
  }, [recherche, secteur, ville])

  async function fetchEntreprises() {
    setLoading(true)
    let query = supabase
      .from('entreprises')
      .select('*')
      .order('note_moyenne', { ascending: false })

    if (recherche) query = query.ilike('nom', `%${recherche}%`)
    if (secteur !== 'Tous') query = query.eq('secteur', secteur)
    if (ville !== 'Toutes') query = query.eq('ville', ville)

    const { data } = await query
    if (data) setEntreprises(data as Entreprise[])
    setLoading(false)
  }

  return (
    <div style={{ backgroundColor: '#ffffff' }}>

      {/* Hero */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f0f0f0' }} className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div style={{ color: '#00C092' }} className="text-sm font-semibold uppercase tracking-widest mb-3">
                Un "consommateur" averti en vaut 2
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: '#1a1a1a' }}>
            Trouvez les meilleures<br />entreprises ivoiriennes
          </h1>
          <p className="text-lg mb-10" style={{ color: '#555555' }}>
            Des milliers d'avis de vrais clients pour guider vos choix
          </p>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200">
              <input
                type="text"
                placeholder="🔍  Rechercher une entreprise..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="flex-1 px-5 py-4 text-gray-800 text-base focus:outline-none"
              />
              <button
                style={{ backgroundColor: '#F5CB5C', color: '#1a1a1a' }}
                className="px-6 font-semibold hover:opacity-90 transition"
              >
                Chercher
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10 text-center">
            <div>
              <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{entreprises.length}+</div>
              <div className="text-sm" style={{ color: '#888888' }}>Entreprises</div>
            </div>
            <div style={{ borderLeft: '1px solid #e0e0e0' }} className="pl-8">
              <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>100%</div>
              <div className="text-sm" style={{ color: '#888888' }}>Avis vérifiés</div>
            </div>
            <div style={{ borderLeft: '1px solid #e0e0e0' }} className="pl-8">
              <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Gratuit</div>
              <div className="text-sm" style={{ color: '#888888' }}>Pour tous</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <select
            value={secteur}
            onChange={(e) => setSecteur(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ color: '#1a1a1a', borderColor: '#d1d5db' }}
          >
            {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ color: '#1a1a1a', borderColor: '#d1d5db' }}
          >
            {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>

          {(secteur !== 'Tous' || ville !== 'Toutes' || recherche) && (
            <button
              onClick={() => { setRecherche(''); setSecteur('Tous'); setVille('Toutes') }}
              className="text-sm text-red-500 hover:underline"
            >
              ✕ Réinitialiser
            </button>
          )}

          <span className="text-sm ml-auto" style={{ color: '#888888' }}>
            {entreprises.length} résultat{entreprises.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Liste entreprises */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8" style={{ color: '#1a1a1a' }}>
          Entreprises recommandées
        </h2>

        {loading ? (
          <div className="text-center py-16" style={{ color: '#888888' }}>Chargement...</div>
        ) : entreprises.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl" style={{ color: '#555555' }}>Aucune entreprise trouvée</p>
            <Link
              href="/ajouter"
              style={{ backgroundColor: '#212E53', color: '#ffffff' }}
              className="mt-6 inline-block px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              Ajouter une entreprise
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entreprises.map((entreprise) => (
              <Link
                key={entreprise.id}
                href={`/entreprise/${entreprise.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition hover:-translate-y-0.5 block"
              >
                {/* Header carte */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    style={{ backgroundColor: '#212E53', color: 'white' }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                  >
                    {entreprise.nom.charAt(0)}
                  </div>
                  <span
                    style={{ backgroundColor: '#FFF8E1', color: '#F5CB5C' }}
                    className="text-xs px-2 py-1 rounded-full font-medium"
                  >
                    {entreprise.secteur}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-1" style={{ color: '#1a1a1a' }}>{entreprise.nom}</h3>
                <p className="text-sm mb-3" style={{ color: '#888888' }}>📍 {entreprise.ville}</p>

                {/* Note */}
                <div className="flex items-center gap-2 mb-3">
                  <EtoilesNote note={entreprise.note_moyenne || 0} />
                  <span className="font-bold text-sm" style={{ color: '#1a1a1a' }}>{entreprise.note_moyenne?.toFixed(1) || '0.0'}</span>
                  <span className="text-xs" style={{ color: '#888888' }}>({entreprise.total_avis || 0} avis)</span>
                </div>

                <p className="text-sm line-clamp-2" style={{ color: '#555555' }}>{entreprise.description}</p>

                <div
                  style={{ color: '#212E53' }}
                  className="text-sm font-medium mt-4 flex items-center gap-1"
                >
                  Voir les avis →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      
    </div>
  )
}
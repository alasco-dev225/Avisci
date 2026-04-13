'use client'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Entreprise = {
  id: string
  nom: string
  secteur: string
  description: string
  ville: string
  quartier?: string
  note_moyenne: number
  total_avis: number
  logo_url?: string
  is_verified?: boolean
  created_at?: string
}
type AvisVitrine = {
  id: string
  note: number
  commentaire: string
  auteur_nom: string
  created_at: string
  entreprises: {
    id: string
    nom: string
    secteur: string
    ville: string
  } | null
}

const SECTEURS = ['Tous', 'Télécoms', 'Banque', 'E-commerce', 'Restauration', 'Santé', 'Éducation', 'Transport', 'Immobilier', 'Médias', 'Assurance', 'Commerce', 'Services', 'Autre']
const VILLES = ['Toutes', 'Abidjan', 'Bouaké', 'Daloa', 'San-Pédro', 'Yamoussoukro', 'Korhogo', 'Man', 'Gagnoa']
const PAR_PAGE = 12

const SECTEUR_ICONS: Record<string, string> = {
  Télécoms: '📶',
  Banque: '🏦',
  'E-commerce': '🛒',
  Restauration: '🍽️',
  Santé: '🏥',
  Éducation: '🎓',
  Transport: '🚕',
  Immobilier: '🏠',
  Médias: '📺',
  Assurance: '🛡️',
  Commerce: '🏪',
  Services: '🧰',
  Autre: '🏢',
}

function normalize(input: string) {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

function EtoilesNote({ note }: { note: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(note) ? '#D4A843' : '#E2DDD6', fontSize: '13px' }}>★</span>
      ))}
    </div>
  )
}

export default function Home() {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [avisVitrine, setAvisVitrine] = useState<AvisVitrine[]>([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [secteur, setSecteur] = useState('Tous')
  const [ville, setVille] = useState('Toutes')
  const [quartier, setQuartier] = useState('Tous')
  const [tri, setTri] = useState<'note' | 'nom' | 'recent'>('note')
  const [noteMin, setNoteMin] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchEntreprises()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [recherche, secteur, ville, quartier, tri, noteMin])

  async function fetchEntreprises() {
    setLoading(true)
    const [entreprisesRes, avisRes] = await Promise.all([
      supabase.from('entreprises').select('*'),
      supabase
        .from('avis')
        .select('id, note, commentaire, auteur_nom, created_at, entreprises(id, nom, secteur, ville)')
        .order('note', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6),
    ])
    const { data } = entreprisesRes
    setEntreprises((data || []) as Entreprise[])
    setAvisVitrine((avisRes.data || []) as AvisVitrine[])
    setLoading(false)
  }

  const quartiersDisponibles = useMemo(() => {
    const base = entreprises
      .filter((e) => (ville === 'Toutes' || e.ville === ville) && e.quartier)
      .map((e) => e.quartier as string)
    return ['Tous', ...Array.from(new Set(base)).sort((a, b) => a.localeCompare(b))]
  }, [entreprises, ville])

  const filtered = useMemo(() => {
    const needle = normalize(recherche)
    const arr = entreprises.filter((e) => {
      const haystack = normalize(`${e.nom} ${e.description || ''} ${e.secteur} ${e.ville} ${e.quartier || ''}`)
      if (needle && !haystack.includes(needle)) return false
      if (secteur !== 'Tous' && e.secteur !== secteur) return false
      if (ville !== 'Toutes' && e.ville !== ville) return false
      if (quartier !== 'Tous' && e.quartier !== quartier) return false
      if (noteMin > 0 && (e.note_moyenne || 0) < noteMin) return false
      return true
    })

    arr.sort((a, b) => {
      if (tri === 'nom') return a.nom.localeCompare(b.nom)
      if (tri === 'recent') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      return (b.note_moyenne || 0) - (a.note_moyenne || 0)
    })

    return arr
  }, [entreprises, recherche, secteur, ville, quartier, noteMin, tri])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAR_PAGE))
  const paginated = filtered.slice((page - 1) * PAR_PAGE, page * PAR_PAGE)
  const entreprisesTop = [...entreprises]
    .filter((e) => (e.total_avis || 0) >= 3)
    .sort((a, b) => (b.note_moyenne || 0) - (a.note_moyenne || 0))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1B2B4B]">
      <header className="relative overflow-hidden bg-gradient-to-br from-[#1B2B4B] via-[#243659] to-[#1B2B4B] px-4 sm:px-6 py-14 sm:py-20 text-center">
        <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-[#F28C28]/15" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#2E8B57]/20" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white text-xs tracking-wide mb-4">🇨🇮 Design local pro</p>
          <h1 className="text-white text-3xl sm:text-5xl font-bold">Avis locaux en Côte d'Ivoire</h1>
          <p className="text-white/75 mt-3 max-w-xl mx-auto text-sm sm:text-base">Recherche avancée, filtre par quartier, commerces vérifiés et interface pensée pour les utilisateurs ivoiriens.</p>

          <div className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Entreprise, secteur, quartier..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/95"
            />
            <Link href="/carte" className="px-5 py-3 rounded-xl bg-[#D4A843] font-semibold text-[#1B2B4B]">Carte interactive</Link>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-white/90">
            <div className="rounded-lg bg-white/10 p-2">🏪 Commerce local</div>
            <div className="rounded-lg bg-white/10 p-2">✅ Vérifié</div>
            <div className="rounded-lg bg-white/10 p-2">📍 Par quartier</div>
            <div className="rounded-lg bg-white/10 p-2">⚡ Rapide mobile</div>
          </div>
        </div>
      </header>

      <section className="sticky top-0 z-30 bg-white border-b border-[#E8E2D8] backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
          <select value={secteur} onChange={(e) => setSecteur(e.target.value)} className="border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm bg-[#FBFAF8]">{SECTEURS.map((s) => <option key={s}>{s}</option>)}</select>
          <select value={ville} onChange={(e) => { setVille(e.target.value); setQuartier('Tous') }} className="border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm bg-[#FBFAF8]">{VILLES.map((v) => <option key={v}>{v}</option>)}</select>
          <select value={quartier} onChange={(e) => setQuartier(e.target.value)} className="border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm bg-[#FBFAF8]">{quartiersDisponibles.map((q) => <option key={q}>{q}</option>)}</select>
          <select value={tri} onChange={(e) => setTri(e.target.value as 'note' | 'nom' | 'recent')} className="border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm bg-[#FBFAF8]">
            <option value="note">Mieux notées</option><option value="nom">Nom A-Z</option><option value="recent">Ajouts récents</option>
          </select>
          <select value={noteMin} onChange={(e) => setNoteMin(Number(e.target.value))} className="border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm bg-[#FBFAF8]">
            <option value={0}>Toutes les notes</option><option value={3}>3+ étoiles</option><option value={4}>4+ étoiles</option>
          </select>
          <button onClick={() => { setRecherche(''); setSecteur('Tous'); setVille('Toutes'); setQuartier('Tous'); setTri('note'); setNoteMin(0) }} className="text-sm text-red-500 border border-[#E2DDD6] rounded-lg px-3 py-2">Réinitialiser</button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <section className="mb-8 grid lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">⭐ Meilleurs avis récents</h2>
              <span className="text-xs text-gray-500">Inspiré des pages d'avis modernes</span>
            </div>
            <div className="space-y-3">
              {avisVitrine.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun avis mis en avant pour l'instant.</p>
              ) : (
                avisVitrine.map((a) => (
                  <Link key={a.id} href={a.entreprises ? `/entreprise/${a.entreprises.id}` : '/'} className="block rounded-xl border border-[#EEE7DC] p-3 hover:bg-[#FCFAF7]">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">{a.entreprises?.nom || 'Entreprise'}</p>
                      <p className="text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{a.entreprises?.secteur} · {a.entreprises?.ville}</p>
                    <p className="text-sm mt-1 line-clamp-2">“{a.commentaire}”</p>
                    <p className="text-xs mt-1 text-[#1B2B4B]">{'★'.repeat(Math.max(1, Math.min(5, a.note)))} par {a.auteur_nom || 'Client'}</p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">🔥 Entreprises à suivre</h2>
              <Link href="/carte" className="text-xs text-[#1B2B4B]">Voir plus</Link>
            </div>
            <div className="space-y-3">
              {entreprisesTop.map((e, i) => (
                <Link key={e.id} href={`/entreprise/${e.id}`} className="flex items-center justify-between rounded-xl border border-[#EEE7DC] px-3 py-2 hover:bg-[#FCFAF7]">
                  <div>
                    <p className="text-sm font-medium">{i + 1}. {e.nom}</p>
                    <p className="text-xs text-gray-500">{SECTEUR_ICONS[e.secteur] || '🏢'} {e.secteur} · {e.ville}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{e.note_moyenne?.toFixed(1) || '0.0'}</p>
                    <p className="text-xs text-gray-500">{e.total_avis || 0} avis</p>
                  </div>
                </Link>
              ))}
              {entreprisesTop.length === 0 && <p className="text-sm text-gray-500">Pas assez d'avis pour calculer un top fiable.</p>}
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-between gap-2 mb-6">
          <p className="text-sm text-gray-500">{total} résultat{total > 1 ? 's' : ''} · Page {page}/{totalPages}</p>
          <Link href="/ajouter" className="text-sm font-medium text-[#1B2B4B]">+ Ajouter une entreprise</Link>
        </div>

        {loading ? <div className="py-20 text-center text-gray-500">Chargement...</div> : (
          paginated.length === 0 ? <div className="py-20 text-center">Aucune entreprise trouvée.</div> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((e) => (
                <Link key={e.id} href={`/entreprise/${e.id}`} className="bg-white rounded-2xl border border-[#E8E2D8] p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
                  <div className="flex justify-between mb-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-[#1B2B4B] text-[#D4A843] font-bold">
                      {e.logo_url ? <Image src={e.logo_url} alt={e.nom} fill sizes="48px" className="object-cover" /> : e.nom.charAt(0)}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#F3EFE8]">{SECTEUR_ICONS[e.secteur] || '🏢'} {e.secteur}</span>
                      {e.is_verified && <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Commerce vérifié</span>}
                    </div>
                  </div>
                  <h3 className="font-semibold text-[#1B2B4B]">{e.nom}</h3>
                  <p className="text-xs text-gray-500 mt-1">📍 {e.ville}{e.quartier ? `, ${e.quartier}` : ''}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <EtoilesNote note={e.note_moyenne || 0} />
                    <span className="text-sm">{e.note_moyenne?.toFixed(1) || '0.0'} ({e.total_avis || 0})</span>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        <div className="flex justify-center gap-2 mt-10">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-2 border rounded disabled:opacity-40">Précédent</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-2 border rounded disabled:opacity-40">Suivant</button>
        </div>
      </main>
    </div>
  )
}

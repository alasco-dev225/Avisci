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

const SECTEURS = ['Tous', 'Télécoms', 'Banque', 'E-commerce', 'Restauration', 'Santé', 'Éducation', 'Transport', 'Immobilier', 'Médias', 'Assurance', 'Commerce', 'Services', 'Autre']
const VILLES = ['Toutes', 'Abidjan', 'Bouaké', 'Daloa', 'San-Pédro', 'Yamoussoukro', 'Korhogo', 'Man', 'Gagnoa']
const PAR_PAGE = 12

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
    const { data } = await supabase.from('entreprises').select('*')
    setEntreprises((data || []) as Entreprise[])
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

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <header className="bg-gradient-to-br from-[#1B2B4B] to-[#243659] px-4 sm:px-6 py-14 sm:py-20 text-center">
        <h1 className="text-white text-3xl sm:text-5xl font-bold">Avis locaux en Côte d'Ivoire</h1>
        <p className="text-white/70 mt-3 max-w-xl mx-auto text-sm sm:text-base">Recherche avancée, filtre par quartier et entreprises vérifiées.</p>
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
      </header>

      <section className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
          <select value={secteur} onChange={(e) => setSecteur(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">{SECTEURS.map((s) => <option key={s}>{s}</option>)}</select>
          <select value={ville} onChange={(e) => { setVille(e.target.value); setQuartier('Tous') }} className="border rounded-lg px-3 py-2 text-sm">{VILLES.map((v) => <option key={v}>{v}</option>)}</select>
          <select value={quartier} onChange={(e) => setQuartier(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">{quartiersDisponibles.map((q) => <option key={q}>{q}</option>)}</select>
          <select value={tri} onChange={(e) => setTri(e.target.value as 'note' | 'nom' | 'recent')} className="border rounded-lg px-3 py-2 text-sm">
            <option value="note">Mieux notées</option><option value="nom">Nom A-Z</option><option value="recent">Ajouts récents</option>
          </select>
          <select value={noteMin} onChange={(e) => setNoteMin(Number(e.target.value))} className="border rounded-lg px-3 py-2 text-sm">
            <option value={0}>Toutes les notes</option><option value={3}>3+ étoiles</option><option value={4}>4+ étoiles</option>
          </select>
          <button onClick={() => { setRecherche(''); setSecteur('Tous'); setVille('Toutes'); setQuartier('Tous'); setTri('note'); setNoteMin(0) }} className="text-sm text-red-500 border rounded-lg px-3 py-2">Réinitialiser</button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-wrap justify-between gap-2 mb-6">
          <p className="text-sm text-gray-500">{total} résultat{total > 1 ? 's' : ''} · Page {page}/{totalPages}</p>
          <Link href="/ajouter" className="text-sm font-medium text-[#1B2B4B]">+ Ajouter une entreprise</Link>
        </div>

        {loading ? <div className="py-20 text-center text-gray-500">Chargement...</div> : (
          paginated.length === 0 ? <div className="py-20 text-center">Aucune entreprise trouvée.</div> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((e) => (
                <Link key={e.id} href={`/entreprise/${e.id}`} className="bg-white rounded-2xl border p-5 shadow-sm hover:-translate-y-1 transition">
                  <div className="flex justify-between mb-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-[#1B2B4B] text-[#D4A843] font-bold">
                      {e.logo_url ? <Image src={e.logo_url} alt={e.nom} fill sizes="48px" className="object-cover" /> : e.nom.charAt(0)}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{e.secteur}</span>
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

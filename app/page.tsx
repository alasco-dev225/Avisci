'use client'
import Image from 'next/image'
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
  logo_url?: string
  created_at?: string
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

const PAR_PAGE = 12

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
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [tri, setTri] = useState<'note' | 'nom' | 'recent'>('note')
  const [noteMin, setNoteMin] = useState(0)

  useEffect(() => {
    setPage(1)
  }, [recherche, secteur, ville, tri, noteMin])

  useEffect(() => {
    fetchEntreprises()
  }, [recherche, secteur, ville, page, tri, noteMin])

  async function fetchEntreprises() {
    setLoading(true)

    let query = supabase
      .from('entreprises')
      .select('*', { count: 'exact' })
      .range((page - 1) * PAR_PAGE, page * PAR_PAGE - 1)

    if (tri === 'note') query = query.order('note_moyenne', { ascending: false })
    if (tri === 'nom') query = query.order('nom', { ascending: true })
    if (tri === 'recent') query = query.order('created_at', { ascending: false })
    if (recherche) query = query.ilike('nom', `%${recherche}%`)
    if (secteur !== 'Tous') query = query.eq('secteur', secteur)
    if (ville !== 'Toutes') query = query.eq('ville', ville)
    if (noteMin > 0) query = query.gte('note_moyenne', noteMin)

    const { data, count } = await query
    if (data) setEntreprises(data as Entreprise[])
    if (count !== null) setTotal(count)
    setLoading(false)
  }

  const totalPages = Math.ceil(total / PAR_PAGE)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; background: #F8F7F4; }
        .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(27,43,75,0.12); }
        .search-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(212,168,67,0.2); }
        .page-btn { transition: all 0.2s; }
        .page-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div style={{ backgroundColor: '#F8F7F4', minHeight: '100vh' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(160deg, #1B2B4B 0%, #243659 60%, #1B2B4B 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,67,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div className="max-w-5xl mx-auto px-6 py-24 text-center" style={{ position: 'relative', zIndex: 1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)' }}>
              <span style={{ color: '#D4A843', fontSize: '13px', fontWeight: 500, letterSpacing: '0.05em' }}>🇨🇮 PLATEFORME #1 EN CÔTE D'IVOIRE</span>
            </div>

            <h1 className="font-display mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Trouvez les meilleures<br />
              <span style={{ color: '#D4A843' }}>entreprises ivoiriennes</span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.125rem', fontWeight: 300, marginBottom: '3rem', maxWidth: '480px', margin: '0 auto 3rem' }}>
              Des milliers d'avis authentiques pour guider vos décisions au quotidien
            </p>

            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '6px' }}>
                <input
                  type="text"
                  placeholder="Rechercher une entreprise..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="search-input flex-1 bg-transparent px-5 py-3 text-white placeholder-white/40 text-sm font-body"
                  style={{ border: 'none' }}
                />
                <button style={{ backgroundColor: '#D4A843', color: '#1B2B4B', borderRadius: '14px', padding: '12px 28px', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>
                  Rechercher
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-12">
              {[
                { val: `${total}+`, label: 'Entreprises' },
                { val: '100%', label: 'Avis vérifiés' },
                { val: 'Gratuit', label: 'Pour tous' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF' }}>{s.val}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: 400, marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FILTRES */}
        <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #EDE9E3', position: 'sticky', top: '0', zIndex: 40, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-3 items-center">
            <select value={secteur} onChange={(e) => setSecteur(e.target.value)}
              className="font-body text-sm px-4 py-2 rounded-xl border"
              style={{ borderColor: '#E2DDD6', color: '#1B2B4B', backgroundColor: '#FAFAF8' }}>
              {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={ville} onChange={(e) => setVille(e.target.value)}
              className="font-body text-sm px-4 py-2 rounded-xl border"
              style={{ borderColor: '#E2DDD6', color: '#1B2B4B', backgroundColor: '#FAFAF8' }}>
              {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select value={tri} onChange={(e) => setTri(e.target.value as 'note' | 'nom' | 'recent')}
              className="font-body text-sm px-4 py-2 rounded-xl border"
              style={{ borderColor: '#E2DDD6', color: '#1B2B4B', backgroundColor: '#FAFAF8' }}>
              <option value="note">Mieux notées</option>
              <option value="nom">Nom A-Z</option>
              <option value="recent">Ajouts récents</option>
            </select>
            <select value={noteMin} onChange={(e) => setNoteMin(Number(e.target.value))}
              className="font-body text-sm px-4 py-2 rounded-xl border"
              style={{ borderColor: '#E2DDD6', color: '#1B2B4B', backgroundColor: '#FAFAF8' }}>
              <option value={0}>Toutes les notes</option>
              <option value={3}>3+ étoiles</option>
              <option value={4}>4+ étoiles</option>
            </select>
            {(secteur !== 'Tous' || ville !== 'Toutes' || recherche || tri !== 'note' || noteMin !== 0) && (
              <button onClick={() => { setRecherche(''); setSecteur('Tous'); setVille('Toutes'); setTri('note'); setNoteMin(0) }}
                className="text-sm font-medium" style={{ color: '#E05252' }}>
                ✕ Réinitialiser
              </button>
            )}
            <span className="ml-auto text-sm" style={{ color: '#9B9589' }}>
              {total} résultat{total > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* LISTE */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1B2B4B', letterSpacing: '-0.02em' }}>
                Entreprises recommandées
              </h2>
              <p style={{ color: '#9B9589', fontSize: '14px', marginTop: '4px' }}>
                Page {page} sur {totalPages} — {total} établissements
              </p>
            </div>
            <Link href="/ajouter" style={{ color: '#1B2B4B', fontSize: '14px', fontWeight: 500, borderBottom: '1px solid #D4A843', paddingBottom: '2px' }}>
              + Ajouter une entreprise
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20" style={{ color: '#9B9589' }}>Chargement...</div>
          ) : entreprises.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p style={{ color: '#6B6560', fontSize: '1.125rem' }}>Aucune entreprise trouvée</p>
              <Link href="/ajouter" className="mt-6 inline-block px-6 py-3 rounded-xl text-white text-sm font-medium"
                style={{ backgroundColor: '#1B2B4B' }}>
                Ajouter une entreprise
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {entreprises.map((e) => (
                  <Link key={e.id} href={`/entreprise/${e.id}`}
                    className="card-hover block bg-white rounded-2xl p-6"
                    style={{ border: '1px solid #EDE9E3', boxShadow: '0 2px 8px rgba(27,43,75,0.05)' }}>

                    <div className="flex justify-between items-start mb-5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center font-display font-bold text-lg"
                        style={{ backgroundColor: '#1B2B4B', color: '#D4A843' }}>
                        {e.logo_url
                          ? <Image src={e.logo_url} alt={e.nom} fill sizes="48px" className="object-cover" />
                          : e.nom.charAt(0)
                        }
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ backgroundColor: '#F3F0EA', color: '#6B6560' }}>
                        {e.secteur}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold mb-1" style={{ color: '#1B2B4B', fontSize: '1.05rem' }}>{e.nom}</h3>
                    <p className="text-sm mb-4" style={{ color: '#9B9589' }}>📍 {e.ville}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <EtoilesNote note={e.note_moyenne || 0} />
                      <span className="font-semibold text-sm" style={{ color: '#1B2B4B' }}>{e.note_moyenne?.toFixed(1) || '0.0'}</span>
                      <span className="text-xs" style={{ color: '#C4BFB8' }}>({e.total_avis || 0} avis)</span>
                    </div>

                    <p className="text-sm mb-5 line-clamp-2" style={{ color: '#6B6560', lineHeight: 1.6 }}>{e.description}</p>

                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #F0EDE8' }}>
                      <span className="text-sm font-medium" style={{ color: '#D4A843' }}>Voir les avis →</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-center gap-2 mt-16">
                <button
                  onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0) }}
                  disabled={page === 1}
                  className="page-btn px-4 py-2 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: page === 1 ? '#F0EDE8' : '#1B2B4B',
                    color: page === 1 ? '#C4BFB8' : '#FFFFFF',
                    cursor: page === 1 ? 'not-allowed' : 'pointer'
                  }}>
                  ← Précédent
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2))
                  .map((p, index, arr) => (
                    <div key={p} className="flex items-center gap-2">
                      {index > 0 && arr[index - 1] !== p - 1 && (
                        <span style={{ color: '#C4BFB8' }}>...</span>
                      )}
                      <button
                        onClick={() => { setPage(p); window.scrollTo(0, 0) }}
                        className="page-btn w-10 h-10 rounded-xl text-sm font-medium"
                        style={{
                          backgroundColor: page === p ? '#D4A843' : '#FFFFFF',
                          color: page === p ? '#1B2B4B' : '#6B6560',
                          border: page === p ? 'none' : '1px solid #EDE9E3',
                          fontWeight: page === p ? 700 : 400,
                        }}>
                        {p}
                      </button>
                    </div>
                  ))
                }

                <button
                  onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0) }}
                  disabled={page === totalPages}
                  className="page-btn px-4 py-2 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: page === totalPages ? '#F0EDE8' : '#1B2B4B',
                    color: page === totalPages ? '#C4BFB8' : '#FFFFFF',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer'
                  }}>
                  Suivant →
                </button>
              </div>

              <p className="text-center text-sm mt-4" style={{ color: '#C4BFB8' }}>
                Affichage {(page - 1) * PAR_PAGE + 1} — {Math.min(page * PAR_PAGE, total)} sur {total} entreprises
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
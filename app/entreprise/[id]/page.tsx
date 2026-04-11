'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Entreprise = {
  id: string
  nom: string
  secteur: string
  description: string
  ville: string
  adresse?: string
  telephone?: string
  site_web?: string
  note_moyenne: number
  total_avis: number
}

type Avis = {
  id: string
  auteur_nom: string
  note: number
  titre: string
  commentaire: string
  created_at: string
}

type User = {
  email?: string
  user_metadata?: { nom?: string }
}

function EtoilesNote({ note, size = 'md' }: { note: number, size?: 'sm' | 'md' | 'lg' }) {
  const taille = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-sm' : 'text-xl'
  return (
    <div className={`flex items-center gap-0.5 ${taille}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(note) ? '#c9a832' : '#e5e7eb' }}>★</span>
      ))}
    </div>
  )
}

function EtoilesSelecteur({ value, onChange }: { value: number, onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="text-3xl transition-transform hover:scale-110"
          style={{ color: i <= (hover || value) ? '#c9a832' : '#e5e7eb' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function BadgeNote({ note }: { note: number }) {
  const couleur = note >= 4 ? '#1a7a3c' : note >= 3 ? '#c9a832' : '#dc2626'
  const label = note >= 4 ? 'Excellent' : note >= 3 ? 'Bien' : 'Mauvais'
  return (
    <span style={{ backgroundColor: couleur }} className="text-white text-xs px-2 py-0.5 rounded-full font-medium">
      {label}
    </span>
  )
}

export default function EntreprisePage() {
  const { id } = useParams()
  const router = useRouter()
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null)
  const [avis, setAvis] = useState<Avis[]>([])
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState(0)
  const [envoi, setEnvoi] = useState(false)
  const [succes, setSucces] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchData()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
  }, [id])

  async function fetchData() {
    const { data: ent } = await supabase
      .from('entreprises').select('*').eq('id', id).single()
    const { data: avisData } = await supabase
      .from('avis').select('*').eq('entreprise_id', id)
      .order('created_at', { ascending: false })
    if (ent) setEntreprise(ent)
    if (avisData) setAvis(avisData)
    setLoading(false)
  }

  async function soumettreAvis(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) {
      router.push('/auth')
      return
    }
    if (note === 0) return alert('Veuillez choisir une note')
    setEnvoi(true)
    const form = e.currentTarget
    const formData = new FormData(form)

    await supabase.from('avis').insert({
      entreprise_id: id,
      auteur_nom: user.user_metadata?.nom || user.email || 'Anonyme',
      note,
      titre: formData.get('titre'),
      commentaire: formData.get('commentaire'),
    })

    form.reset()
    setNote(0)
    setEnvoi(false)
    setSucces(true)
    setTimeout(() => setSucces(false), 3000)
    fetchData()
  }

  function distributionNotes() {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    avis.forEach(a => dist[a.note] = (dist[a.note] || 0) + 1)
    return dist
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div style={{ color: '#1a7a3c' }} className="text-xl">Chargement...</div>
    </div>
  )

  if (!entreprise) return (
    <div className="text-center py-16">
      <p className="text-gray-500">Entreprise introuvable</p>
      <Link href="/" style={{ color: '#1a7a3c' }} className="mt-4 inline-block hover:underline">
        Retour
      </Link>
    </div>
  )

  const dist = distributionNotes()

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #0f5228 100%)' }} className="text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-green-300 hover:text-white text-sm mb-6 inline-block">
            Retour
          </Link>
          <div className="flex items-start gap-6">
            <div style={{ backgroundColor: '#c9a832' }} className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg flex-shrink-0">
              {entreprise.nom.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{entreprise.nom}</h1>
                <span style={{ backgroundColor: '#c9a832', color: '#1a1a1a' }} className="text-xs px-3 py-1 rounded-full font-semibold">
                  {entreprise.secteur}
                </span>
              </div>
              <p className="text-green-200 mb-4">
                {entreprise.ville}{entreprise.adresse ? ` • ${entreprise.adresse}` : ''}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <EtoilesNote note={entreprise.note_moyenne || 0} size="lg" />
                <span className="text-3xl font-bold">{entreprise.note_moyenne?.toFixed(1) || '0.0'}</span>
                <span className="text-green-300">({entreprise.total_avis || 0} avis)</span>
              </div>
            </div>
          </div>
          {(entreprise.telephone || entreprise.site_web) && (
            <div className="flex gap-4 mt-6 flex-wrap">
              {entreprise.telephone && <span className="text-green-200 text-sm">{entreprise.telephone}</span>}
              {entreprise.site_web && (
                <a href={entreprise.site_web} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#c9a832' }} className="text-sm hover:underline">
                  Site web
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">

        {/* Colonne gauche */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-3">A propos</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{entreprise.description || 'Aucune description.'}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4">Repartition des notes</h3>
            {[5, 4, 3, 2, 1].map(n => (
              <div key={n} className="flex items-center gap-2 mb-2">
                <span className="text-sm w-4 text-gray-600">{n}</span>
                <span style={{ color: '#c9a832' }} className="text-sm">★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    style={{
                      width: avis.length ? `${(dist[n] / avis.length) * 100}%` : '0%',
                      backgroundColor: '#1a7a3c'
                    }}
                    className="h-2 rounded-full transition-all"
                  />
                </div>
                <span className="text-xs text-gray-400 w-4">{dist[n]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne droite */}
        <div className="md:col-span-2 space-y-6">

          {/* Formulaire avis */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-5" style={{ color: '#1a7a3c' }}>
              Laisser un avis
            </h2>

            {!user ? (
              <div style={{ backgroundColor: '#e8f5ee' }} className="rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Connectez-vous pour laisser un avis
                </p>
                <Link
                  href="/auth"
                  style={{ backgroundColor: '#1a7a3c' }}
                  className="inline-block text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
                >
                  Se connecter
                </Link>
                <p className="text-sm text-gray-400 mt-3">
                  Pas de compte ?{' '}
                  <Link href="/auth" style={{ color: '#1a7a3c' }} className="font-medium hover:underline">
                    Inscription gratuite
                  </Link>
                </p>
              </div>
            ) : (
              <>
                {succes && (
                  <div style={{ backgroundColor: '#e8f5ee', color: '#1a7a3c' }} className="p-4 rounded-lg mb-4 font-medium">
                    Merci ! Votre avis a ete publie.
                  </div>
                )}

                <div style={{ backgroundColor: '#f0fdf4' }} className="rounded-lg p-3 mb-4 flex items-center gap-2">
                  <div style={{ backgroundColor: '#1a7a3c', color: 'white' }} className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {(user.user_metadata?.nom || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-600">
                    Vous publiez en tant que <strong>{user.user_metadata?.nom || user.email}</strong>
                  </span>
                </div>

                <form onSubmit={soumettreAvis} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Votre note *</label>
                    <EtoilesSelecteur value={note} onChange={setNote} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                    <input
                      name="titre"
                      required
                      placeholder="Resumez votre experience"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire *</label>
                    <textarea
                      name="commentaire"
                      required
                      rows={4}
                      placeholder="Decrivez votre experience..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={envoi}
                    style={{ backgroundColor: '#1a7a3c' }}
                    className="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {envoi ? 'Publication...' : 'Publier mon avis'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Liste avis */}
          <div>
            <h2 className="text-xl font-bold mb-4">Avis clients ({avis.length})</h2>
            {avis.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
                <p className="text-4xl mb-3">💬</p>
                <p>Aucun avis pour le moment.</p>
                <p className="text-sm mt-1">Soyez le premier !</p>
              </div>
            ) : (
              <div className="space-y-4">
                {avis.map((a) => (
                  <div key={a.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div style={{ backgroundColor: '#e8f5ee', color: '#1a7a3c' }} className="w-10 h-10 rounded-full flex items-center justify-center font-bold">
                          {a.auteur_nom.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{a.auteur_nom}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <EtoilesNote note={a.note} size="sm" />
                        <BadgeNote note={a.note} />
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800 mb-1">{a.titre}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{a.commentaire}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
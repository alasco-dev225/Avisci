'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Entreprise = {
  id: string
  nom: string
  secteur: string
  description: string
  ville: string
  quartier?: string
  adresse?: string
  telephone?: string
  site_web?: string
  note_moyenne: number
  total_avis: number
  is_verified?: boolean
  claimed_by?: string
}

type Avis = {
  id: string
  auteur_nom: string
  note: number
  titre: string
  commentaire: string
  audio_url?: string
  created_at: string
}

type ReponseAvis = {
  id: string
  avis_id: string
  contenu: string
  created_at: string
}

type User = {
  id?: string
  email?: string
  user_metadata?: { nom?: string }
}

function EtoilesSelecteur({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1 text-3xl">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} style={{ color: i <= value ? '#c9a832' : '#e5e7eb' }}>★</button>
      ))}
    </div>
  )
}

export default function EntreprisePage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const router = useRouter()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const [entreprise, setEntreprise] = useState<Entreprise | null>(null)
  const [avis, setAvis] = useState<Avis[]>([])
  const [reponses, setReponses] = useState<Record<string, ReponseAvis>>({})
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState(0)
  const [envoi, setEnvoi] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [xp, setXp] = useState(0)
  const [claimMessage, setClaimMessage] = useState('')
  const [claimStatus, setClaimStatus] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [reportingAvisId, setReportingAvisId] = useState<string | null>(null)
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({})
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null)

  const isOwner = Boolean(user?.id && entreprise?.claimed_by && user.id === entreprise.claimed_by)

  useEffect(() => {
    if (!id) return
    fetchData()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    const localXp = Number(localStorage.getItem('avisci_xp') || '0')
    setXp(localXp)
    return () => listener.subscription.unsubscribe()
  }, [id])

  useEffect(() => {
    if (!audioBlob) {
      setAudioPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(audioBlob)
    setAudioPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [audioBlob])

  async function fetchData() {
    if (!id) return
    setLoading(true)
    const { data: ent } = await supabase.from('entreprises').select('*').eq('id', id).single()
    const { data: avisData } = await supabase.from('avis').select('*').eq('entreprise_id', id).order('created_at', { ascending: false })
    const { data: repsData } = await supabase.from('reponses_entreprises').select('*').eq('entreprise_id', id)

    if (ent) setEntreprise(ent)
    if (avisData) setAvis(avisData)
    if (repsData) {
      const map = (repsData as ReponseAvis[]).reduce<Record<string, ReponseAvis>>((acc, rep) => {
        acc[rep.avis_id] = rep
        return acc
      }, {})
      setReponses(map)
    }
    setResponseDrafts(
      (avisData || []).reduce<Record<string, string>>((acc, item) => {
        acc[item.id] = (repsData as ReponseAvis[] | null)?.find((rep) => rep.avis_id === item.id)?.contenu || ''
        return acc
      }, {}),
    )
    setLoading(false)
  }

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    const chunks: Blob[] = []
    recorder.ondataavailable = (event) => chunks.push(event.data)
    recorder.onstop = () => setAudioBlob(new Blob(chunks, { type: 'audio/webm' }))
    mediaRecorderRef.current = recorder
    recorder.start()
    setRecording(true)
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  async function uploadAudioIfAny() {
    if (!audioBlob) return null
    const filePath = `voice-reviews/${id}/${Date.now()}.webm`
    const { error } = await supabase.storage.from('reviews-audio').upload(filePath, audioBlob, { upsert: false, contentType: 'audio/webm' })
    if (error) return null
    const { data } = supabase.storage.from('reviews-audio').getPublicUrl(filePath)
    return data.publicUrl
  }

  async function soumettreAvis(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setActionMessage(null)
    if (!user) return router.push('/auth')
    if (note === 0) return alert('Veuillez choisir une note')
    setEnvoi(true)
    const formData = new FormData(e.currentTarget)
    const audio_url = await uploadAudioIfAny()

    const { error } = await supabase.from('avis').insert({
      entreprise_id: id,
      auteur_nom: user.user_metadata?.nom || user.email || 'Anonyme',
      note,
      titre: formData.get('titre'),
      commentaire: formData.get('commentaire'),
      audio_url,
      user_id: user.id,
    })
    if (error) {
      setEnvoi(false)
      setActionMessage(error.message)
      return
    }

    const nextXp = xp + (audio_url ? 30 : 20)
    setXp(nextXp)
    localStorage.setItem('avisci_xp', String(nextXp))
    e.currentTarget.reset()
    setAudioBlob(null)
    setNote(0)
    setEnvoi(false)
    setActionMessage('Merci ! Votre avis a été publié.')
    fetchData()
  }

  async function revendiquerFiche() {
    setActionMessage(null)
    if (!user) return router.push('/auth')
    const { error } = await supabase.from('revendications_entreprises').insert({
      entreprise_id: id,
      user_id: user.id,
      message: claimMessage || null,
      status: 'pending',
    })
    setClaimStatus(error ? error.message : 'Demande envoyée. Elle sera vérifiée par un administrateur.')
    setClaimMessage('')
  }

  async function repondreAvis(avisId: string, contenu: string) {
    if (!user || !entreprise || !contenu.trim()) return
    setActionMessage(null)
    const payload = {
      avis_id: avisId,
      entreprise_id: entreprise.id,
      user_id: user.id,
      contenu: contenu.trim(),
    }

    const existing = reponses[avisId]
    const query = existing
      ? supabase.from('reponses_entreprises').update({ contenu: payload.contenu, updated_at: new Date().toISOString() }).eq('id', existing.id)
      : supabase.from('reponses_entreprises').insert(payload)

    const { error } = await query
    if (!error) {
      setActionMessage('Réponse publiée.')
      fetchData()
    } else {
      setActionMessage(error.message)
    }
  }

  async function signalerAvis(avisId: string) {
    setActionMessage(null)
    if (!user) return router.push('/auth')
    const motif = window.prompt('Motif du signalement (spam, faux avis, langage inapproprié...) ?')
    if (!motif) return
    setReportingAvisId(avisId)

    const { error } = await supabase.from('signalements_avis').insert({
      avis_id: avisId,
      reported_by: user.id,
      motif,
      commentaire: 'Signalement envoyé depuis la fiche entreprise',
    })
    setReportingAvisId(null)

    setActionMessage(error ? `Erreur: ${error.message}` : 'Merci, le signalement a été envoyé.')
  }

  if (loading || !entreprise) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

  const reviewUrl = typeof window !== 'undefined' ? `${window.location.origin}/entreprise/${id}#laisser-un-avis` : ''
  const qrUrl = reviewUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(reviewUrl)}` : ''
  const gamerLevel = xp >= 300 ? 'Ambassadeur local' : xp >= 120 ? 'Contributeur confirmé' : 'Nouveau contributeur'

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-[#1a7a3c] text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <Link href="/" className="text-green-200 text-sm">← Retour</Link>
          <h1 className="text-3xl font-bold mt-3">{entreprise.nom}</h1>
          <p className="text-green-100 mt-1">{entreprise.ville}{entreprise.quartier ? ` • ${entreprise.quartier}` : ''}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">{entreprise.secteur}</span>
            {entreprise.is_verified && <span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">Commerce vérifié</span>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <aside className="space-y-4">
          <div className="bg-white rounded-xl p-5 border">
            <h3 className="font-semibold mb-2">À propos</h3>
            <p className="text-sm text-gray-600">{entreprise.description || 'Aucune description.'}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border">
            <h3 className="font-semibold mb-2">Espace commerçant</h3>
            {isOwner ? (
              <p className="text-sm text-green-700">Vous êtes le propriétaire vérifié de cette fiche.</p>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-2">Revendiquer cette fiche pour répondre officiellement aux avis.</p>
                <textarea
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Ex: Je suis le gérant, voici ma preuve..."
                />
                <button onClick={revendiquerFiche} className="mt-2 w-full bg-[#1a7a3c] text-white py-2 rounded-lg text-sm">Revendiquer ma fiche</button>
                {claimStatus && <p className="text-xs text-gray-500 mt-2">{claimStatus}</p>}
              </>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 border">
            <h3 className="font-semibold mb-2">QR code sans appli</h3>
            {qrUrl && <img src={qrUrl} alt="QR code avis" className="rounded-lg border" />}
            <p className="text-xs text-gray-500 mt-2">Les clients scannent et laissent un avis directement.</p>
          </div>

          <div className="bg-white rounded-xl p-5 border">
            <h3 className="font-semibold mb-1">Gamification</h3>
            <p className="text-sm">Niveau: <strong>{gamerLevel}</strong></p>
            <p className="text-xs text-gray-500 mt-1">XP: {xp} (20 par avis texte, 30 avec avis vocal)</p>
          </div>
        </aside>

        <section className="lg:col-span-2 space-y-5" id="laisser-un-avis">
          <div className="bg-white rounded-xl p-6 border">
            <h2 className="text-xl font-bold mb-4">Laisser un avis</h2>
            {actionMessage && <p className="mb-3 text-sm text-gray-600">{actionMessage}</p>}
            {!user ? (
              <Link href="/auth" className="inline-block bg-[#1a7a3c] text-white px-4 py-2 rounded-lg">Se connecter</Link>
            ) : (
              <form onSubmit={soumettreAvis} className="space-y-4">
                <EtoilesSelecteur value={note} onChange={setNote} />
                <input name="titre" required placeholder="Titre" className="w-full border rounded-lg px-4 py-2" />
                <textarea name="commentaire" required rows={4} placeholder="Votre expérience..." className="w-full border rounded-lg px-4 py-2" />

                <div className="border rounded-lg p-3">
                  <p className="text-sm font-medium mb-2">Avis vocal (optionnel)</p>
                  <div className="flex gap-2 items-center flex-wrap">
                    {!recording ? (
                      <button type="button" onClick={startRecording} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">🎙️ Démarrer</button>
                    ) : (
                      <button type="button" onClick={stopRecording} className="px-3 py-2 rounded bg-red-600 text-white text-sm">⏹️ Stop</button>
                    )}
                    {audioPreviewUrl && <audio controls src={audioPreviewUrl} className="h-10" />}
                  </div>
                </div>

                <button disabled={envoi} className="w-full bg-[#1a7a3c] text-white py-3 rounded-lg">{envoi ? 'Publication...' : 'Publier mon avis'}</button>
              </form>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold">Avis clients ({avis.length})</h2>
            {avis.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{a.titre} · {a.note}/5</p>
                  <button onClick={() => signalerAvis(a.id)} className="text-xs text-red-500 hover:underline">
                    {reportingAvisId === a.id ? 'Signalement...' : 'Signaler'}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">{a.commentaire}</p>
                {a.audio_url && <audio controls src={a.audio_url} className="mt-3 w-full" />}

                {reponses[a.id] && (
                  <div className="mt-3 rounded-lg bg-green-50 border border-green-100 p-3">
                    <p className="text-xs text-green-700 font-semibold mb-1">Réponse du commerce</p>
                    <p className="text-sm text-green-900">{reponses[a.id].contenu}</p>
                  </div>
                )}

                {isOwner && (
                  <form
                    className="mt-3"
                    onSubmit={(e) => {
                      e.preventDefault()
                      repondreAvis(a.id, responseDrafts[a.id] || '')
                    }}
                  >
                    <textarea
                      name="reponse"
                      rows={2}
                      value={responseDrafts[a.id] || ''}
                      onChange={(e) => setResponseDrafts((prev) => ({ ...prev, [a.id]: e.target.value }))}
                      placeholder="Répondre à cet avis en tant que commerce..."
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                    <button className="mt-2 bg-[#1a7a3c] text-white px-3 py-2 rounded text-xs">Publier la réponse</button>
                  </form>
                )}

                <p className="text-xs text-gray-400 mt-2">{a.auteur_nom} · {new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            ))}
            {avis.length === 0 && <div className="bg-white border rounded-xl p-6 text-gray-500">Aucun avis pour le moment.</div>}
          </div>
        </section>
      </div>
    </div>
  )
}

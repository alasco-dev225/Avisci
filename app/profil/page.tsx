'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

type Profile = {
  id: string
  nom: string
  bio: string
  avatar_url: string
}

type Avis = {
  id: string
  note: number
  commentaire: string
  created_at: string
  entreprises: { id: string, nom: string }
}
type OwnedEntreprise = {
  id: string
  nom: string
  logo_url?: string
  secteur?: string
  ville?: string
}

function Etoiles({ note }: { note: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= note ? '#F5CB5C' : '#d1d5db' }}>★</span>
      ))}
    </div>
  )
}

export default function ProfilPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<{ id: string, email?: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [avis, setAvis] = useState<Avis[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [nom, setNom] = useState('')
  const [bio, setBio] = useState('')
  const [succes, setSucces] = useState(false)
  const [ownedEntreprises, setOwnedEntreprises] = useState<OwnedEntreprise[]>([])
  const [uploadingLogoId, setUploadingLogoId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/auth'); return }
      setUser(data.user)

      // Charger profil
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (p) {
        setProfile(p)
        setNom(p.nom || '')
        setBio(p.bio || '')
      } else {
        setNom(data.user.user_metadata?.nom || '')
      }

      // Charger historique avis
      const { data: a } = await supabase
        .from('avis')
        .select('*, entreprises(id, nom)')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })

      if (a) setAvis(a as Avis[])

      const { data: owned } = await supabase
        .from('entreprises')
        .select('id, nom, logo_url, secteur, ville')
        .eq('claimed_by', data.user.id)
        .order('nom', { ascending: true })

      if (owned) setOwnedEntreprises(owned as OwnedEntreprise[])
      setLoading(false)
    })
  }, [])

  async function sauvegarder() {
    if (!user) return
    setSaving(true)

    await supabase.from('profiles').upsert({
      id: user.id,
      nom,
      bio,
      avatar_url: profile?.avatar_url || null,
    })

    setProfile(prev => prev ? { ...prev, nom, bio } : null)
    setEditMode(false)
    setSucces(true)
    setTimeout(() => setSucces(false), 3000)
    setSaving(false)
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user || !e.target.files?.[0]) return
    setUploadingPhoto(true)
    const file = e.target.files[0]
    const path = `${user.id}/${Date.now()}.${file.name.split('.').pop()}`

    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })

    if (!error) {
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      const avatar_url = urlData.publicUrl

      await supabase.from('profiles').upsert({ id: user.id, nom, bio, avatar_url })
      setProfile(prev => prev ? { ...prev, avatar_url } : { id: user.id, nom, bio, avatar_url })
    }
    setUploadingPhoto(false)
  }

  async function uploadLogoEntreprise(entrepriseId: string, file: File) {
    if (!user) return
    setUploadingLogoId(entrepriseId)
    const extension = file.name.split('.').pop() || 'png'
    const path = `${entrepriseId}/${Date.now()}.${extension}`

    const { error } = await supabase.storage.from('company-logos').upload(path, file, { upsert: true })

    if (!error) {
      const { data: urlData } = supabase.storage.from('company-logos').getPublicUrl(path)
      await supabase.from('entreprises').update({ logo_url: urlData.publicUrl }).eq('id', entrepriseId).eq('claimed_by', user.id)
      setOwnedEntreprises((prev) => prev.map((ent) => (ent.id === entrepriseId ? { ...ent, logo_url: urlData.publicUrl } : ent)))
    }

    setUploadingLogoId(null)
  }

  if (loading) return (
    <div className="text-center py-20 text-gray-400">Chargement...</div>
  )

  return (
    <div style={{ backgroundColor: '#ffffff' }} className="min-h-screen">

      {/* Header */}
      <div style={{ backgroundColor: '#212E53' }} className="py-12">
        <div className="max-w-3xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6">

          {/* Photo */}
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center cursor-pointer border-4"
              style={{ borderColor: '#F5CB5C', backgroundColor: '#2e3d6b' }}
              onClick={() => fileRef.current?.click()}
            >
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Avatar" width={96} height={96} className="object-cover w-full h-full" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {nom?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              style={{ backgroundColor: '#F5CB5C', color: '#1a1a1a' }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center"
            >
              {uploadingPhoto ? '...' : '✏️'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
          </div>

          {/* Infos */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-white">{nom || 'Mon profil'}</h1>
            <p style={{ color: '#aab4c8' }} className="text-sm mt-1">{user?.email}</p>
            {profile?.bio && (
              <p style={{ color: '#d1d9e8' }} className="text-sm mt-2 max-w-md">{profile.bio}</p>
            )}
            <div className="flex gap-4 mt-3 justify-center md:justify-start">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{avis.length}</div>
                <div style={{ color: '#aab4c8' }} className="text-xs">Avis rédigés</div>
              </div>
            </div>
          </div>

          {/* Bouton modifier */}
          <button
            onClick={() => setEditMode(!editMode)}
            style={{ backgroundColor: '#F5CB5C', color: '#1a1a1a' }}
            className="px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
          >
            {editMode ? 'Annuler' : '✏️ Modifier'}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {succes && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg">
            ✅ Profil mis à jour avec succès !
          </div>
        )}

        {/* Formulaire modification */}
        {editMode && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-lg" style={{ color: '#212E53' }}>Modifier mon profil</h2>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#212E53' }}>Nom</label>
              <input
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Votre nom"
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#212E53' }}>Biographie</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Parlez de vous en quelques mots..."
                rows={3}
                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>

            <button
              onClick={sauvegarder}
              disabled={saving}
              style={{ backgroundColor: '#212E53', color: '#ffffff' }}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        )}

        {/* Historique avis */}
        <div>
          <h2 className="font-bold text-xl mb-4" style={{ color: '#212E53' }}>
            📝 Mes avis ({avis.length})
          </h2>

          {avis.length === 0 ? (
            <div className="text-center py-10 border border-gray-100 rounded-xl">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-gray-500">Vous n'avez pas encore rédigé d'avis</p>
              <Link
                href="/"
                style={{ backgroundColor: '#212E53', color: '#ffffff' }}
                className="mt-4 inline-block px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
              >
                Découvrir des entreprises
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {avis.map(a => (
                <div key={a.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/entreprise/${a.entreprises?.id}`}
                      className="font-bold hover:underline"
                      style={{ color: '#212E53' }}
                    >
                      {a.entreprises?.nom}
                    </Link>
                    <span className="text-xs text-gray-400">
                      {new Date(a.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <Etoiles note={a.note} />
                  <p className="text-sm text-gray-600 mt-2">{a.commentaire}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-bold text-xl mb-4" style={{ color: '#212E53' }}>
            🏢 Mes établissements ({ownedEntreprises.length})
          </h2>
          {ownedEntreprises.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-sm text-gray-500">
              Vous n'avez pas encore de fiche revendiquée.
            </div>
          ) : (
            <div className="space-y-4">
              {ownedEntreprises.map((ent) => (
                <div key={ent.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
                      {ent.logo_url ? (
                        <Image src={ent.logo_url} alt={ent.nom} fill sizes="64px" className="object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-gray-400">{ent.nom.charAt(0)}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold" style={{ color: '#212E53' }}>{ent.nom}</p>
                      <p className="text-xs text-gray-500">{ent.secteur} · {ent.ville}</p>
                    </div>

                    <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer" style={{ backgroundColor: '#212E53', color: '#fff' }}>
                      {uploadingLogoId === ent.id ? 'Upload...' : 'Changer le logo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) uploadLogoEntreprise(ent.id, file)
                          e.currentTarget.value = ''
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

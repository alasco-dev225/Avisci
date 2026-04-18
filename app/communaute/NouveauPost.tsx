'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, X, Plus } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['⭐ Recommandation', '💡 Bon plan', '❓ Question', '💬 Discussion']
const TAGS_SUGERES = ['✅ Recommandé', '💰 Bon prix', '❤️ Coup de cœur', '👨‍👩‍👧 Famille', '🌿 Local', '⭐ Premium']

interface Props {
  user: User | null
  compact?: boolean
}

export default function NouveauPost({ user, compact }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [categorie, setCategorie] = useState('💬 Discussion')
  const [entreprisesTaguees, setEntreprisesTaguees] = useState<{ nom: string; emoji: string }[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [entrepriseInput, setEntrepriseInput] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!user) {
    return compact ? (
      <Link href="/auth" className="block bg-white text-orange-600 text-center py-2.5 rounded-xl font-bold text-sm">
        Se connecter pour poster
      </Link>
    ) : (
      <Link
        href="/auth"
        className="flex items-center gap-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors w-full"
      >
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">✍️</div>
        Connectez-vous pour partager une expérience...
      </Link>
    )
  }

  if (compact) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="block bg-white text-orange-600 text-center py-2.5 rounded-xl font-bold text-sm w-full"
      >
        ✍️ Créer une discussion
      </button>
    )
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (photos.length + files.length > 4) return alert('Maximum 4 photos')
    setPhotos((prev) => [...prev, ...files])
    files.forEach((f) => {
      const url = URL.createObjectURL(f)
      setPreviews((prev) => [...prev, url])
    })
  }

  function removePhoto(i: number) {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i))
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  function addTag(tag: string) {
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag])
    setTagInput('')
  }

  function addEntreprise() {
    if (entrepriseInput && !entreprisesTaguees.find((e) => e.nom === entrepriseInput)) {
      setEntreprisesTaguees((prev) => [...prev, { nom: entrepriseInput, emoji: '🏢' }])
      setEntrepriseInput('')
    }
  }

  async function handleSubmit() {
    if (!titre.trim() || !contenu.trim()) return alert('Titre et contenu requis')
    setLoading(true)

    try {
      // Upload photos
      const photoUrls: string[] = []
      for (const file of photos) {
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from('forum-photos').upload(path, file)
        if (!error) {
          const { data } = supabase.storage.from('forum-photos').getPublicUrl(path)
          photoUrls.push(data.publicUrl)
        }
      }

      // Créer le post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({ user_id: user.id, titre, contenu, categorie, photos: photoUrls })
        .select()
        .single()

      if (postError || !post) throw postError

      // Tags entreprises
      if (entreprisesTaguees.length > 0) {
        await supabase.from('post_entreprises').insert(
          entreprisesTaguees.map((e) => ({ post_id: post.id, entreprise_nom: e.nom, entreprise_emoji: e.emoji }))
        )
      }

      // Tags libres
      if (tags.length > 0) {
        await supabase.from('post_tags').insert(tags.map((t) => ({ post_id: post.id, tag: t })))
      }

      // Reset
      setTitre(''); setContenu(''); setTags([]); setEntreprisesTaguees([])
      setPhotos([]); setPreviews([]); setOpen(false)
      router.refresh()
    } catch (e) {
      alert('Erreur lors de la publication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Bouton déclencheur */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors w-full"
        >
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">✍️</div>
          Partager une expérience ou recommandation...
        </button>
      ) : (
        /* Formulaire complet */
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg text-gray-900">Nouvelle discussion</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Catégorie */}
          <div className="flex gap-2 flex-wrap mb-4">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategorie(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  categorie === c
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-orange-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Titre */}
          <input
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre de votre discussion..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 mb-3"
          />

          {/* Contenu */}
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Partagez votre expérience en détail..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 resize-none mb-3"
          />

          {/* Tagger une entreprise */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">🏢 Tagger une entreprise</p>
            <div className="flex gap-2">
              <input
                value={entrepriseInput}
                onChange={(e) => setEntrepriseInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEntreprise()}
                placeholder="Nom de l'entreprise..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
              <Button size="sm" onClick={addEntreprise} variant="outline" className="rounded-xl">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {entreprisesTaguees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {entreprisesTaguees.map((e) => (
                  <span key={e.nom} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium">
                    {e.emoji} {e.nom}
                    <button onClick={() => setEntreprisesTaguees((prev) => prev.filter((x) => x.nom !== e.nom))}>
                      <X className="h-3 w-3 ml-1" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">🏷️ Tags</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {TAGS_SUGERES.map((t) => (
                <button
                  key={t}
                  onClick={() => addTag(t)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors ${
                    tags.includes(t)
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag(tagInput)}
                placeholder="Ajouter un tag personnalisé..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
              <Button size="sm" onClick={() => addTag(tagInput)} variant="outline" className="rounded-xl">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Photos */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 mb-2">📷 Photos (max 4)</p>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {photos.length < 4 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors"
                >
                  <ImageIcon className="h-6 w-6 mb-1" />
                  <span className="text-xs">Ajouter</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-6"
            >
              {loading ? 'Publication...' : '🚀 Publier'}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
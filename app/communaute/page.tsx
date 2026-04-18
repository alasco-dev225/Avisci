import { createServerClient } from '@/lib/supabase-server'
import NouveauPost from './NouveauPost'
import PostCard from './PostCard'
import { ChevronRight } from 'lucide-react'

const CATEGORIES = ['🔥 Tendance', '🆕 Récent', '⭐ Top avis', '💡 Recommandations', '❓ Questions']

const SUJETS = [
  { emoji: '🍗', bg: '#FFF7ED', nom: 'Bons maquis', count: 48 },
  { emoji: '💇', bg: '#FDF2F8', nom: 'Coiffure & Beauté', count: 32 },
  { emoji: '🚗', bg: '#EFF6FF', nom: 'Garages fiables', count: 27 },
  { emoji: '💊', bg: '#ECFDF5', nom: 'Santé & Pharmacie', count: 19 },
]

const TAGS_POPULAIRES = [
  { label: '✅ Recommandé', style: 'bg-green-50 text-green-700 border-green-200' },
  { label: '🔥 Tendance', style: 'bg-orange-50 text-orange-700 border-orange-200' },
  { label: '💰 Bon prix', style: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: '❤️ Coup de cœur', style: 'bg-pink-50 text-pink-700 border-pink-200' },
  { label: '⭐ Premium', style: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: '👨‍👩‍👧 Famille', style: 'bg-orange-50 text-orange-700 border-orange-200' },
  { label: '🌿 Local', style: 'bg-green-50 text-green-700 border-green-200' },
]

export default async function CommunautePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      post_entreprises(*),
      post_tags(*),
      commentaires(
        *
      )
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: likes } = user
    ? await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id)
    : { data: [] }

  const likedPostIds = new Set((likes || []).map((l: any) => l.post_id))

  return (
    <div className="min-h-screen bg-[#F9F7F4]">

      {/* HERO */}
      <section
        className="relative py-16 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2a1a 60%, #1a0a00 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,102,0,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,102,0,0.07) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 px-6">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 text-orange-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6">
            💬 Communauté AvisCI
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Le coin des <span className="text-orange-500">vraies expériences</span>
          </h1>
          <p className="text-white/60 text-base mb-0">
            Partagez, recommandez et découvrez les bonnes adresses
          </p>
        </div>
      </section>

      {/* LAYOUT */}
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* POSTS — colonne principale */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Filtres */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                  i === 0
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Formulaire nouveau post */}
          <NouveauPost user={user} />

          {/* Liste des posts */}
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <PostCard
                key={post.id}
                post={post}
                user={user}
                isLiked={likedPostIds.has(post.id)}
              />
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-gray-500 font-medium">Soyez le premier à partager une expérience !</p>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="flex flex-col gap-4">

          {/* Sujets populaires */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">🔥 Sujets populaires</p>
            <div className="flex flex-col gap-1">
              {SUJETS.map((s) => (
                <div key={s.nom} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-xl px-2 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: s.bg }}>
                    {s.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-600 text-gray-900 font-semibold">{s.nom}</p>
                    <p className="text-xs text-gray-400">{s.count} discussions</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 ml-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Tags populaires */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">🏷️ Tags populaires</p>
            <div className="flex flex-wrap gap-2">
              {TAGS_POPULAIRES.map((t) => (
                <span key={t.label} className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer ${t.style}`}>
                  {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
            <div className="text-3xl mb-3">✍️</div>
            <p className="font-bold text-base mb-1">Partagez votre expérience</p>
            <p className="text-white/80 text-xs leading-relaxed mb-4">
              Aidez la communauté à trouver les meilleures adresses
            </p>
            <NouveauPost user={user} compact />
          </div>

        </div>
      </div>
    </div>
  )
}
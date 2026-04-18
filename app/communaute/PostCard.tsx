'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, Send } from 'lucide-react'
import Link from 'next/link'

interface Props {
  post: any
  user: User | null
  isLiked: boolean
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return "À l'instant"
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`
  return `Il y a ${Math.floor(diff / 86400)} jour(s)`
}

function Initiales({ nom, className }: { nom: string; className?: string }) {
  const colors = ['bg-orange-500', 'bg-green-600', 'bg-[#1B2B4B]', 'bg-purple-600', 'bg-pink-500']
  const color = colors[nom.charCodeAt(0) % colors.length]
  return (
    <div className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${color} ${className}`}>
      {nom.slice(0, 2).toUpperCase()}
    </div>
  )
}

const CATEGORIE_STYLE: Record<string, string> = {
  '⭐ Recommandation': 'bg-orange-50 text-orange-700 border-orange-200',
  '💡 Bon plan': 'bg-green-50 text-green-700 border-green-200',
  '❓ Question': 'bg-blue-50 text-blue-700 border-blue-200',
  '💬 Discussion': 'bg-gray-50 text-gray-700 border-gray-200',
}

export default function PostCard({ post, user, isLiked: initialLiked }: Props) {
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [showComments, setShowComments] = useState(false)
  const [commentTexte, setCommentTexte] = useState('')
  const [commentaires, setCommentaires] = useState(post.commentaires || [])
  const [loadingComment, setLoadingComment] = useState(false)
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  const auteurNom = post.auteur_nom || post.user_id?.slice(0, 8) || 'Utilisateur'
  const photos: string[] = post.photos || []

  async function handleLike() {
    if (!user) return router.push('/auth')
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id)
      await supabase.from('posts').update({ likes_count: likesCount - 1 }).eq('id', post.id)
      setLiked(false)
      setLikesCount((n: number) => n - 1)
    } else {
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: user.id })
      await supabase.from('posts').update({ likes_count: likesCount + 1 }).eq('id', post.id)
      setLiked(true)
      setLikesCount((n: number) => n + 1)
    }
  }

  async function handleComment() {
    if (!user) return router.push('/auth')
    if (!commentTexte.trim()) return
    setLoadingComment(true)
    const { data } = await supabase
      .from('commentaires')
      .insert({ post_id: post.id, user_id: user.id, contenu: commentTexte })
      .select()
      .single()
    if (data) {
      setCommentaires((prev: any[]) => [...prev, data])
      await supabase.from('posts').update({ comments_count: commentaires.length + 1 }).eq('id', post.id)
    }
    setCommentTexte('')
    setLoadingComment(false)
  }

  const photosAffichees = showAllPhotos ? photos : photos.slice(0, 3)

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">

      {/* En-tête */}
      <div className="flex items-start gap-3 mb-4">
        <Initiales nom={auteurNom} className="w-11 h-11 text-sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-gray-900">{auteurNom}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORIE_STYLE[post.categorie] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
              {post.categorie}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{timeAgo(post.created_at)}</p>
        </div>
      </div>

      {/* Titre + contenu */}
      <h3 className="font-bold text-base text-gray-900 mb-2 leading-snug">{post.titre}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.contenu}</p>

      {/* Photos */}
      {photos.length > 0 && (
        <div className={`grid gap-2 mb-4 ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {photosAffichees.map((url: string, i: number) => (
            <div key={i} className="relative">
              <img
                src={url}
                alt=""
                className="w-full h-48 object-cover rounded-2xl"
              />
              {!showAllPhotos && i === 2 && photos.length > 3 && (
                <button
                  onClick={() => setShowAllPhotos(true)}
                  className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                >
                  +{photos.length - 3}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tags entreprises */}
      {post.post_entreprises?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.post_entreprises.map((e: any) => (
            <span
              key={e.id}
              className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full font-semibold hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-colors cursor-pointer"
            >
              {e.entreprise_emoji} {e.entreprise_nom}
            </span>
          ))}
        </div>
      )}

      {/* Tags libres */}
      {post.post_tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.post_tags.map((t: any) => (
            <span key={t.id} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full font-semibold">
              {t.tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
            liked
              ? 'bg-orange-50 text-orange-600 border-orange-200'
              : 'bg-white text-gray-400 border-gray-200 hover:border-orange-200 hover:text-orange-500'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-orange-500' : ''}`} />
          {likesCount}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {commentaires.length} commentaire{commentaires.length > 1 ? 's' : ''}
        </button>

        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:border-green-200 hover:text-green-500 transition-colors ml-auto">
          <Share2 className="h-3.5 w-3.5" />
          Partager
        </button>
      </div>

      {/* Commentaires */}
      {showComments && (
        <div className="mt-4 space-y-3">
          {commentaires.map((c: any) => (
            <div key={c.id} className="bg-[#F9F7F4] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Initiales nom={c.user_id?.slice(0, 2) || 'U'} className="w-7 h-7 text-xs" />
                <span className="text-xs font-semibold text-gray-700">Utilisateur</span>
                <span className="text-xs text-gray-400">{timeAgo(c.created_at)}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{c.contenu}</p>
            </div>
          ))}

          {/* Zone de commentaire */}
          {user ? (
            <div className="flex gap-2 mt-3">
              <input
                value={commentTexte}
                onChange={(e) => setCommentTexte(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                placeholder="Écrire un commentaire..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              />
              <Button
                size="sm"
                onClick={handleComment}
                disabled={loadingComment}
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="block text-center text-sm text-orange-600 font-semibold py-3 bg-orange-50 rounded-2xl border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              Connectez-vous pour commenter
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
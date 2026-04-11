'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'connexion' | 'inscription'>('connexion')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', texte: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'inscription') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nom } }
      })
      if (error) setMessage({ type: 'error', texte: error.message })
      else setMessage({ type: 'success', texte: 'Compte créé ! Vérifiez votre email pour confirmer.' })
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage({ type: 'error', texte: 'Email ou mot de passe incorrect.' })
      else router.push('/')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">⭐</span>
          <h1 className="text-2xl font-bold mt-2">AvisCI</h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'connexion' ? 'Connectez-vous à votre compte' : 'Créez votre compte gratuit'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setMode('connexion'); setMessage(null) }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'connexion' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setMode('inscription'); setMessage(null) }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'inscription' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            Inscription
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.texte}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'inscription' && (
            <div>
              <label className="block text-sm font-medium mb-1">Votre nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                placeholder="Ex: Kouassi Jean"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Chargement...' : mode === 'connexion' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  )
}
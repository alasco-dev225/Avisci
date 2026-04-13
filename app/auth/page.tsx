'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type AuthMethod = 'email' | 'phone'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'connexion' | 'inscription'>('connexion')
  const [method, setMethod] = useState<AuthMethod>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [phone, setPhone] = useState('+225')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; texte: string } | null>(null)

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'inscription') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nom } },
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

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: mode === 'inscription',
        data: { nom },
      },
    })

    if (error) {
      setMessage({ type: 'error', texte: error.message })
    } else {
      setOtpSent(true)
      setMessage({ type: 'success', texte: 'Code SMS envoyé. Entrez le code de vérification.' })
    }
    setLoading(false)
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    })

    if (error) setMessage({ type: 'error', texte: error.message })
    else {
      setMessage({ type: 'success', texte: 'Téléphone vérifié, connexion réussie.' })
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">⭐</span>
          <h1 className="text-2xl font-bold mt-2">AvisCI</h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'connexion' ? 'Connectez-vous à votre compte' : 'Créez votre compte gratuit'}
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => {
              setMode('connexion')
              setMessage(null)
            }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'connexion' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => {
              setMode('inscription')
              setMessage(null)
            }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'inscription' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            Inscription
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setMethod('email')
              setOtpSent(false)
              setMessage(null)
            }}
            className={`flex-1 border rounded-lg py-2 text-sm ${method === 'email' ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-500'}`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod('phone')
              setMessage(null)
            }}
            className={`flex-1 border rounded-lg py-2 text-sm ${method === 'phone' ? 'border-blue-600 text-blue-600' : 'border-gray-200 text-gray-500'}`}
          >
            Téléphone + SMS
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.texte}
          </div>
        )}

        {method === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'inscription' && (
              <div>
                <label className="block text-sm font-medium mb-1">Votre nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  placeholder="Ex: Kouassi Jean"
                  className="w-full border rounded-lg px-4 py-2"
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
                className="w-full border rounded-lg px-4 py-2"
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
                className="w-full border rounded-lg px-4 py-2"
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
        ) : (
          <>
            {!otpSent ? (
              <form onSubmit={sendOtp} className="space-y-4">
                {mode === 'inscription' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Votre nom</label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone (format +225xxxxxxxx)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : 'Envoyer le code SMS'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Code SMS</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="123456"
                    className="w-full border rounded-lg px-4 py-2 tracking-[0.25em]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Vérification...' : 'Vérifier le code'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

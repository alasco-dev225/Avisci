'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('Compte cree. Verifie ton email pour confirmer ton inscription.');
      setTimeout(() => {
        router.push('/auth');
      }, 1200);
    } catch {
      setError('Une erreur inattendue est survenue. Reessaie dans un instant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Inscription</h1>
        <p className="text-center text-gray-600 mb-8">Cree ton compte AvisCI</p>

        {message && (
        <div className={`px-4 py-3 rounded-2xl mb-6 border ${
         message.type === 'error' 
       ? 'bg-red-100 border-red-400 text-red-700' 
       : 'bg-green-100 border-green-400 text-green-700'
      }`}>
      {message.texte}
      </div>
       )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-2xl mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500"
              placeholder="exemple@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-70"
          >
            {loading ? 'Creation en cours...' : 'Creer mon compte'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Tu as deja un compte ?{' '}
          <Link href="/auth" className="text-orange-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Entreprise = {
  id: string
  nom: string
  secteur: string
  ville: string
  note_moyenne: number | null
  total_avis: number | null
  description: string | null
}

export default function EntreprisesPage() {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const secteur = (searchParams.get('secteur') || '').trim()

  useEffect(() => {
    async function fetchEntreprises() {
      setLoading(true)
      setError('')

      let query = supabase
        .from('entreprises')
        .select('id, nom, secteur, ville, note_moyenne, total_avis, description')
        .order('note_moyenne', { ascending: false, nullsFirst: false })

      if (secteur) {
        query = query.eq('secteur', secteur)
      }

      const { data, error: queryError } = await query

      if (queryError) {
        setError(queryError.message)
      } else {
        setEntreprises((data as Entreprise[]) || [])
      }

      setLoading(false)
    }

    fetchEntreprises()
  }, [secteur])

  const title = useMemo(() => {
    if (!secteur) return 'Entreprises'
    return `Entreprises - ${secteur}`
  }, [secteur])

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold text-[#212E53]">{title}</h1>
          {secteur && (
            <Link href="/entreprises" className="text-sm text-orange-600 hover:underline">
              Voir tous les secteurs
            </Link>
          )}
        </div>

        {loading && <p className="text-gray-500">Chargement...</p>}
        {!loading && error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        {!loading && !error && entreprises.length === 0 && (
          <p className="text-gray-500">Aucune entreprise trouvee pour ce filtre.</p>
        )}

        {!loading && !error && entreprises.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {entreprises.map((entreprise) => (
              <Link
                key={entreprise.id}
                href={`/entreprise/${entreprise.id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-lg font-semibold text-[#212E53] line-clamp-2">{entreprise.nom}</h2>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full shrink-0">
                    {entreprise.secteur || 'Autre'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{entreprise.ville || 'Ville non renseignee'}</p>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {entreprise.description || 'Aucune description'}
                </p>
                <div className="text-sm text-gray-700">
                  Note: <span className="font-semibold">{(entreprise.note_moyenne || 0).toFixed(1)}</span> ({entreprise.total_avis || 0} avis)
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

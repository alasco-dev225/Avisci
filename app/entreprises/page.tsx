'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 9

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
      setPage(1) // reset à la page 1 quand on change de filtre
    }

    fetchEntreprises()
  }, [secteur])

  // Filtre recherche en temps réel
  const filteredEntreprises = useMemo(() => {
    return entreprises.filter((e) =>
      e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [entreprises, searchTerm])

  // Pagination
  const totalPages = Math.ceil(filteredEntreprises.length / itemsPerPage)
  const paginatedEntreprises = filteredEntreprises.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const title = secteur ? `Entreprises - ${secteur}` : 'Toutes les entreprises'

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#212E53]">{title}</h1>
            <p className="text-gray-600 mt-1">
              {filteredEntreprises.length} entreprise{filteredEntreprises.length > 1 ? 's' : ''} trouvée{filteredEntreprises.length > 1 ? 's' : ''}
            </p>
          </div>

          {secteur && (
            <Link
              href="/entreprises"
              className="text-orange-600 hover:underline font-medium flex items-center gap-1"
            >
              ← Voir tous les secteurs
            </Link>
          )}
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Rechercher une entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 py-6 text-lg rounded-3xl border-gray-200 focus:border-orange-300"
          />
        </div>

        {/* États */}
        {loading && (
          <div className="text-center py-20 text-gray-500">Chargement des entreprises...</div>
        )}

        {!loading && error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-2xl text-center">
            {error}
          </div>
        )}

        {!loading && !error && filteredEntreprises.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aucune entreprise trouvée.</p>
          </div>
        )}

        {/* Liste des entreprises */}
        {!loading && !error && filteredEntreprises.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEntreprises.map((entreprise) => (
                <Link
                  key={entreprise.id}
                  href={`/entreprise/${entreprise.id}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-[#212E53] group-hover:text-orange-600 transition-colors line-clamp-2">
                          {entreprise.nom}
                        </h2>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 whitespace-nowrap">
                          {entreprise.secteur || 'Autre'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{entreprise.ville || 'Abidjan'}</span>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                        {entreprise.description || 'Aucune description disponible.'}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i <= Math.round(entreprise.note_moyenne || 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-lg text-orange-600">
                            {(entreprise.note_moyenne || 0).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {entreprise.total_avis || 0} avis
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-2xl"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm font-medium text-gray-600 px-4">
                  Page <span className="font-semibold text-[#212E53]">{page}</span> sur {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-2xl"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
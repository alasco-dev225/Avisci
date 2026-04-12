'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

// Important : charger la carte sans SSR
const MapEntreprises = dynamic(() => import('@/components/MapEntreprises'), { ssr: false })

type Entreprise = {
  id: string
  nom: string
  secteur: string
  ville: string
  note_moyenne: number
  latitude: number
  longitude: number
}

const RAYONS = [1, 2, 5, 10, 20]

function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function CartePage() {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [filtered, setFiltered] = useState<Entreprise[]>([])
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)
  const [rayon, setRayon] = useState(5)
  const [loading, setLoading] = useState(true)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    supabase.from('entreprises').select('*').then(({ data }) => {
      if (data) setEntreprises(data as Entreprise[])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (userPosition) {
      const proches = entreprises.filter(e =>
        e.latitude && e.longitude &&
        distance(userPosition[0], userPosition[1], e.latitude, e.longitude) <= rayon
      )
      setFiltered(proches)
    } else {
      setFiltered(entreprises.filter(e => e.latitude && e.longitude))
    }
  }, [entreprises, userPosition, rayon])

  function localiser() {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude])
        setLocating(false)
      },
      () => {
        alert("Impossible d'obtenir votre position")
        setLocating(false)
      }
    )
  }

  return (
    <div style={{ backgroundColor: '#ffffff' }} className="min-h-screen">

      {/* Header */}
      <div style={{ backgroundColor: '#212E53' }} className="py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🗺️ Carte des entreprises</h1>
        <p style={{ color: '#aab4c8' }}>Trouvez les établissements près de vous</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Contrôles */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <button
            onClick={localiser}
            style={{ backgroundColor: '#F5CB5C', color: '#1a1a1a' }}
            className="px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {locating ? '📡 Localisation...' : '📍 Établissements près de moi'}
          </button>

          {userPosition && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" style={{ color: '#212E53' }}>Rayon :</label>
                <select
                  value={rayon}
                  onChange={(e) => setRayon(Number(e.target.value))}
                  className="border rounded-lg px-3 py-2 text-sm"
                  style={{ color: '#212E53', borderColor: '#d1d5db' }}
                >
                  {RAYONS.map(r => <option key={r} value={r}>{r} km</option>)}
                </select>
              </div>
              <button
                onClick={() => setUserPosition(null)}
                className="text-sm text-red-400 hover:underline"
              >
                ✕ Réinitialiser
              </button>
            </>
          )}

          <span className="text-sm ml-auto" style={{ color: '#888888' }}>
            {filtered.length} établissement{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Carte */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement de la carte...</div>
        ) : (
          <MapEntreprises entreprises={filtered} userPosition={userPosition} />
        )}

        {/* Info si pas de coordonnées */}
        {!loading && filtered.length === 0 && (
          <div className="text-center mt-6 text-gray-400 text-sm">
            Aucun établissement avec des coordonnées GPS dans ce rayon.
          </div>
        )}
      </div>
    </div>
  )
}
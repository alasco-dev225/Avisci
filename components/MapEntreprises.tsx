'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'

// Fix icônes Leaflet avec Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

type Entreprise = {
  id: string
  nom: string
  secteur: string
  ville: string
  note_moyenne: number
  latitude: number
  longitude: number
}

type Props = {
  entreprises: Entreprise[]
  userPosition: [number, number] | null
}

export default function MapEntreprises({ entreprises, userPosition }: Props) {
  const defaultCenter: [number, number] = userPosition || [5.3599, -4.0083] // Abidjan

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: '500px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marqueur position utilisateur */}
      {userPosition && (
        <Marker position={userPosition} icon={L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })}>
          <Popup><strong>📍 Vous êtes ici</strong></Popup>
        </Marker>
      )}

      {/* Marqueurs entreprises */}
      {entreprises
        .filter(e => e.latitude && e.longitude)
        .map(e => (
          <Marker key={e.id} position={[e.latitude, e.longitude]} icon={icon}>
            <Popup>
              <div style={{ minWidth: '150px' }}>
                <p className="font-bold" style={{ color: '#212E53' }}>{e.nom}</p>
                <p className="text-xs text-gray-500">{e.secteur} — {e.ville}</p>
                <p className="text-xs mt-1">⭐ {e.note_moyenne?.toFixed(1) || '0.0'}</p>
                <Link
                  href={`/entreprise/${e.id}`}
                  className="text-xs font-medium mt-2 block"
                  style={{ color: '#212E53' }}
                >
                  Voir les avis →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const SECTEURS = [
  'Télécoms', 'Banque', 'E-commerce', 'Restauration',
  'Santé', 'Éducation', 'Transport', 'Immobilier',
  'Médias', 'Assurance', 'Commerce', 'Services', 'Autre'
]

const VILLES = [
  'Abidjan', 'Bouaké', 'Daloa', 'San-Pédro',
  'Yamoussoukro', 'Korhogo', 'Man', 'Gagnoa', 'Autre'
]

export default function AjouterEntreprise() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [succes, setSucces] = useState(false)
  const [locating, setLocating] = useState(false)
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')

  function localiserAuto() {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toString())
        setLng(pos.coords.longitude.toString())
        setLocating(false)
      },
      () => {
        alert("Impossible d'obtenir la position")
        setLocating(false)
      }
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)

    const { data, error } = await supabase.from('entreprises').insert({
      nom: formData.get('nom'),
      secteur: formData.get('secteur'),
      description: formData.get('description'),
      ville: formData.get('ville'),
      adresse: formData.get('adresse'),
      telephone: formData.get('telephone'),
      site_web: formData.get('site_web'),
      latitude: lat ? parseFloat(lat) : null,
      longitude: lng ? parseFloat(lng) : null,
    }).select().single()

    setLoading(false)

    if (!error && data) {
      setSucces(true)
      setTimeout(() => router.push(`/entreprise/${data.id}`), 2000)
    }
  }

  return (
    <div style={{ backgroundColor: '#ffffff' }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#212E53' }}>Ajouter une entreprise</h1>
        <p className="text-gray-500 mb-8">Enregistrez une entreprise ivoirienne sur AvisCI</p>

        {succes && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
            ✅ Entreprise ajoutée avec succès ! Redirection...
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-5">

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#212E53' }}>Nom de l'entreprise *</label>
            <input
              name="nom"
              required
              placeholder="Ex: Orange CI"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#212E53' }}>Secteur *</label>
            <select name="secteur" required className="w-full border rounded-lg px-4 py-2 focus:outline-none" style={{ borderColor: '#d1d5db' }}>
              <option value="">Choisir un secteur</option>
              {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#212E53' }}>Ville *</label>
            <select name="ville" required className="w-full border rounded-lg px-4 py-2 focus:outline-none" style={{ borderColor: '#d1d5db' }}>
              <option value="">Choisir une ville</option>
              {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#212E53' }}>Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Décrivez l'entreprise en quelques mots..."
              className="w-full border rounded-lg px-4 py-2 focus:outline-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#212E53' }}>Adresse</label>
            <input
              name="adresse"
              placeholder="Ex: Plateau, Rue des Jardins"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#212E53' }}>Téléphone</label>
            <input
              name="telephone"
              placeholder="Ex: +225 07 00 00 00 00"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#212E53' }}>Site web</label>
            <input
              name="site_web"
              placeholder="Ex: https://www.entreprise.ci"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          {/* ✅ COORDONNÉES GPS */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#212E53' }}>
              📍 Localisation GPS
            </label>

            {/* Bouton localisation auto */}
            <button
              type="button"
              onClick={localiserAuto}
              style={{ backgroundColor: '#F5CB5C', color: '#1a1a1a' }}
              className="w-full py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition mb-3"
            >
              {locating ? '📡 Localisation en cours...' : '📍 Utiliser ma position actuelle'}
            </button>

            {/* Champs manuels */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ex: 5.3599"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ex: -4.0083"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
            </div>

            {lat && lng && (
              <p className="text-xs mt-2" style={{ color: '#1a7a3c' }}>
                ✅ Position enregistrée : {parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-2">
              💡 Vous pouvez aussi trouver les coordonnées sur Google Maps en faisant un clic droit sur l'adresse
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#212E53', color: '#ffffff' }}
            className="w-full py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : "Ajouter l'entreprise"}
          </button>

        </form>
      </div>
    </div>
  )
}
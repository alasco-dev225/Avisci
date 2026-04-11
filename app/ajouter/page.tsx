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
    }).select().single()

    setLoading(false)

    if (!error && data) {
      setSucces(true)
      setTimeout(() => router.push(`/entreprise/${data.id}`), 2000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Ajouter une entreprise</h1>
      <p className="text-gray-500 mb-8">Enregistrez une entreprise ivoirienne sur AvisCI</p>

      {succes && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
          ✅ Entreprise ajoutée avec succès ! Redirection...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Nom de l'entreprise *</label>
          <input
            name="nom"
            required
            placeholder="Ex: Orange CI"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Secteur *</label>
          <select name="secteur" required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Choisir un secteur</option>
            {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ville *</label>
          <select name="ville" required className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Choisir une ville</option>
            {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Décrivez l'entreprise en quelques mots..."
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Adresse</label>
          <input
            name="adresse"
            placeholder="Ex: Plateau, Rue des Jardins"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            name="telephone"
            placeholder="Ex: +225 07 00 00 00 00"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Site web</label>
          <input
            name="site_web"
            placeholder="Ex: https://www.entreprise.ci"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Ajouter l\'entreprise'}
        </button>
      </form>
    </div>
  )
}
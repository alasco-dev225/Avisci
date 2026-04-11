'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Entreprise = {
  id: string
  nom: string
  secteur: string
  ville: string
  note_moyenne: number
  total_avis: number
}

type StatSecteur = {
  secteur: string
  count: number
}

function EtoilesNote({ note }: { note: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(note) ? '#c9a832' : '#e5e7eb' }}>★</span>
      ))}
    </div>
  )
}

export default function StatsPage() {
  const [top, setTop] = useState<Entreprise[]>([])
  const [recent, setRecent] = useState<Entreprise[]>([])
  const [secteurs, setSecteurs] = useState<StatSecteur[]>([])
  const [totalEntreprises, setTotalEntreprises] = useState(0)
  const [totalAvis, setTotalAvis] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    // Top entreprises par note
    const { data: topData } = await supabase
      .from('entreprises')
      .select('*')
      .order('note_moyenne', { ascending: false })
      .gt('total_avis', 0)
      .limit(10)

    // Entreprises récentes
    const { data: recentData } = await supabase
      .from('entreprises')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    // Total entreprises
    const { count: totalEnt } = await supabase
      .from('entreprises')
      .select('*', { count: 'exact', head: true })

    // Total avis
    const { count: totalAv } = await supabase
      .from('avis')
      .select('*', { count: 'exact', head: true })

    // Stats par secteur
    const { data: toutesEntreprises } = await supabase
      .from('entreprises')
      .select('secteur')

    if (toutesEntreprises) {
      const comptage: Record<string, number> = {}
      toutesEntreprises.forEach(e => {
        comptage[e.secteur] = (comptage[e.secteur] || 0) + 1
      })
      const secteursData = Object.entries(comptage)
        .map(([secteur, count]) => ({ secteur, count }))
        .sort((a, b) => b.count - a.count)
      setSecteurs(secteursData)
    }

    if (topData) setTop(topData as Entreprise[])
    if (recentData) setRecent(recentData as Entreprise[])
    setTotalEntreprises(totalEnt || 0)
    setTotalAvis(totalAv || 0)
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div style={{ color: '#1a7a3c' }} className="text-xl">Chargement...</div>
    </div>
  )

  const maxSecteur = secteurs[0]?.count || 1

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #0f5228 100%)' }} className="text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">📊 Statistiques AvisCI</h1>
          <p style={{ color: '#a7f3c0' }}>Vue d'ensemble de la plateforme</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

        {/* Chiffres clés */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Entreprises', value: totalEntreprises, icon: '🏢' },
            { label: 'Avis publiés', value: totalAvis, icon: '💬' },
            { label: 'Secteurs', value: secteurs.length, icon: '📁' },
            { label: 'Villes', value: '9+', icon: '📍' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold" style={{ color: '#1a7a3c' }}>{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Top 10 entreprises */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#1a7a3c' }}>
              🏆 Top 10 meilleures entreprises
            </h2>
            {top.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aucun avis pour le moment</p>
            ) : (
              <div className="space-y-3">
                {top.map((ent, index) => (
                  <Link
                    key={ent.id}
                    href={`/entreprise/${ent.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    {/* Rang */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{
                        backgroundColor: index === 0 ? '#c9a832' : index === 1 ? '#9ca3af' : index === 2 ? '#cd7f32' : '#e8f5ee',
                        color: index < 3 ? 'white' : '#1a7a3c'
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{ent.nom}</p>
                      <p className="text-xs text-gray-400">{ent.secteur} • {ent.ville}</p>
                    </div>

                    {/* Note */}
                    <div className="text-right flex-shrink-0">
                      <EtoilesNote note={ent.note_moyenne} />
                      <p className="text-xs text-gray-400">{ent.total_avis} avis</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Stats par secteur */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6" style={{ color: '#1a7a3c' }}>
                📁 Entreprises par secteur
              </h2>
              <div className="space-y-3">
                {secteurs.map((s) => (
                  <div key={s.secteur}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{s.secteur}</span>
                      <span className="text-gray-400">{s.count}</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div
                        style={{
                          width: `${(s.count / maxSecteur) * 100}%`,
                          backgroundColor: '#1a7a3c'
                        }}
                        className="h-2 rounded-full transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Entreprises récentes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: '#1a7a3c' }}>
                🆕 Dernières entreprises ajoutées
              </h2>
              <div className="space-y-3">
                {recent.map((ent) => (
                  <Link
                    key={ent.id}
                    href={`/entreprise/${ent.id}`}
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition"
                  >
                    <div
                      style={{ backgroundColor: '#1a7a3c', color: 'white' }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                    >
                      {ent.nom.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{ent.nom}</p>
                      <p className="text-xs text-gray-400">{ent.secteur}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
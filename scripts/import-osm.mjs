import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Variables manquantes: SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises.'
  )
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
const RETRY_DELAYS = [1500, 3000, 5000]

// Catégories à importer
const CATEGORIES = [
  { osm: 'restaurant', secteur: 'Restauration' },
  { osm: 'bank', secteur: 'Banque' },
  { osm: 'hospital', secteur: 'Santé' },
  { osm: 'clinic', secteur: 'Santé' },
  { osm: 'school', secteur: 'Éducation' },
  { osm: 'university', secteur: 'Éducation' },
  { osm: 'supermarket', secteur: 'Commerce' },
  { osm: 'hotel', secteur: 'Services' },
  { osm: 'pharmacy', secteur: 'Santé' },
]

// Villes CI avec leurs coordonnées
const VILLES = [
  { nom: 'Abidjan', lat: 5.3599, lon: -4.0083, rayon: 20000 },
  { nom: 'Bouaké', lat: 7.6934, lon: -5.0323, rayon: 10000 },
  { nom: 'Daloa', lat: 6.8773, lon: -6.4502, rayon: 8000 },
  { nom: 'Yamoussoukro', lat: 6.8276, lon: -5.2893, rayon: 8000 },
  { nom: 'Korhogo', lat: 9.4580, lon: -5.6296, rayon: 8000 },
  { nom: 'San-Pédro', lat: 4.7485, lon: -6.6363, rayon: 8000 },
]

async function fetchEtablissements(ville, categorie, rayon) {
  const query = `
    [out:json][timeout:30];
    (
      node["amenity"="${categorie}"](around:${rayon},${ville.lat},${ville.lon});
      way["amenity"="${categorie}"](around:${rayon},${ville.lat},${ville.lon});
    );
    out center;
  `

  let lastError

  for (const delay of [0, ...RETRY_DELAYS]) {
    if (delay > 0) await sleep(delay)

    try {
      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        body: query,
      })

      if (!response.ok) {
        throw new Error(`Overpass a répondu ${response.status}`)
      }

      const data = await response.json()
      return data.elements || []
    } catch (error) {
      lastError = error
    }
  }

  throw lastError
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizePhone(value) {
  if (!value) return null
  return String(value).replace(/\s+/g, ' ').trim()
}

function normalizeWebsite(value) {
  if (!value) return null
  const trimmed = String(value).trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

async function importerVille(ville) {
  console.log(`\n📍 Import de ${ville.nom}...`)
  let total = 0

  for (const cat of CATEGORIES) {
    console.log(`  → ${cat.osm}...`)

    try {
      const elements = await fetchEtablissements(ville, cat.osm, ville.rayon)

      for (const el of elements) {
        const tags = el.tags || {}
        const nom = tags.name || tags['name:fr']
        if (!nom) continue // ignorer sans nom

        const lat = el.lat || el.center?.lat
        const lon = el.lon || el.center?.lon
        const osmRef = `${el.type}-${el.id}`

        const entreprise = {
          nom,
          secteur: cat.secteur,
          ville: ville.nom,
          adresse: tags['addr:street'] || tags['addr:full'] || null,
          telephone: normalizePhone(tags.phone || tags['contact:phone']),
          site_web: normalizeWebsite(tags.website || tags['contact:website']),
          description: `${cat.secteur} situé à ${ville.nom}, Côte d'Ivoire.`,
          latitude: lat || null,
          longitude: lon || null,
          note_moyenne: 0,
          total_avis: 0,
          source: 'openstreetmap',
          source_osm_id: osmRef,
        }

        // Vérifier si déjà existant, d'abord par id OSM, ensuite par nom + ville
        const { data: existingByOsm } = await supabase
          .from('entreprises')
          .select('id')
          .eq('source_osm_id', osmRef)
          .maybeSingle()

        const { data: existingByName } = await supabase
          .from('entreprises')
          .select('id')
          .eq('nom', nom)
          .eq('ville', ville.nom)
          .maybeSingle()

        if (!existingByOsm && !existingByName) {
          const { error } = await supabase.from('entreprises').insert(entreprise)
          if (!error) {
            total++
            console.log(`    ✅ ${nom}`)
          } else {
            console.log(`    ⚠️ Insert ignoré pour ${nom}: ${error.message}`)
          }
        }
      }

      // Pause pour ne pas surcharger l'API
      await sleep(1500)

    } catch (err) {
      console.log(`    ⚠️ Erreur: ${err.message}`)
    }
  }

  console.log(`  ✅ ${total} établissements ajoutés pour ${ville.nom}`)
}

async function main() {
  console.log('🚀 Démarrage import OpenStreetMap → Supabase')

  for (const ville of VILLES) {
    await importerVille(ville)
    await sleep(2000)
  }

  console.log('\n🎉 Import terminé !')
}

main()

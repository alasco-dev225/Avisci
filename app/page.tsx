import React from 'react';
import Link from 'next/link';

const entreprisesSeed = [
  {
    id: 1,
    nom: "Maquis Le Bon Coin",
    categorie: "Restauration",
    ville: "Abidjan",
    quartier: "Cocody",
    note: 4.8,
    nbAvis: 124,
    description: "Meilleur attiéké et poulet braisé de Cocody. Ambiance chaleureuse.",
    image: "https://picsum.photos/id/20/400/250",
  },
  {
    id: 2,
    nom: "Pharmacie de la Paix",
    categorie: "Santé",
    ville: "Abidjan",
    quartier: "Plateau",
    note: 4.6,
    nbAvis: 89,
    description: "Pharmacie de garde 24h/24. Personnel très professionnel.",
    image: "https://picsum.photos/id/107/400/250",
  },
  {
    id: 3,
    nom: "Garage Auto Elite",
    categorie: "Automobile",
    ville: "Abidjan",
    quartier: "Yopougon",
    note: 4.4,
    nbAvis: 67,
    description: "Réparation toutes marques. Travail soigné et prix raisonnables.",
    image: "https://picsum.photos/id/201/400/250",
  },
  {
    id: 4,
    nom: "Coiffure Chez Awa",
    categorie: "Beauté",
    ville: "Abidjan",
    quartier: "Marcory",
    note: 4.9,
    nbAvis: 203,
    description: "Spécialiste tresses, extensions et soins capillaires.",
    image: "https://picsum.photos/id/64/400/250",
  },
  {
    id: 5,
    nom: "Hôtel Ivoire Prestige",
    categorie: "Hôtellerie",
    ville: "Abidjan",
    quartier: "Riviera",
    note: 4.7,
    nbAvis: 156,
    description: "Hôtel confortable avec piscine et restaurant de qualité.",
    image: "https://picsum.photos/id/1015/400/250",
  },
];

const categories = [
  { nom: "Restauration", emoji: "🍴", color: "bg-orange-500" },
  { nom: "Santé", emoji: "🩺", color: "bg-green-600" },
  { nom: "Automobile", emoji: "🚗", color: "bg-blue-600" },
  { nom: "Beauté", emoji: "💇‍♀️", color: "bg-pink-500" },
  { nom: "Hôtellerie", emoji: "🏨", color: "bg-amber-600" },
  { nom: "Shopping", emoji: "🛍️", color: "bg-purple-600" },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 via-green-700 to-emerald-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Trouvez les meilleures entreprises<br />en Côte d&apos;Ivoire
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            Des milliers d&apos;avis authentiques pour vous aider à choisir en toute confiance
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Rechercher un restaurant, garage, pharmacie..."
                className="flex-1 px-6 py-4 rounded-xl text-black text-lg focus:outline-none"
              />
              <button className="bg-white text-orange-600 px-10 py-4 rounded-xl font-semibold hover:bg-orange-100 transition">
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-orange-600">50+</p>
            <p className="text-gray-600">Entreprises</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-600">1 200+</p>
            <p className="text-gray-600">Avis vérifiés</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">100%</p>
            <p className="text-gray-600">Avis authentiques</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-600">Abidjan + 5 villes</p>
            <p className="text-gray-600">Couverture</p>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Trouvez par catégorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={index}
                href={`/entreprises?secteur=${encodeURIComponent(cat.nom)}`}
                className={`${cat.color} text-white rounded-2xl p-8 text-center hover:scale-105 transition-all cursor-pointer`}
              >
                <div className="text-5xl mb-4">{cat.emoji}</div>
                <p className="font-semibold text-lg">{cat.nom}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Entreprises les mieux notées */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold">Entreprises les mieux notées</h2>
            <Link href="/entreprises" className="text-orange-600 font-medium hover:underline">Voir tout →</Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {entreprisesSeed.map((entreprise) => (
              <div
                key={entreprise.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition border border-gray-100"
              >
                <img
                  src={entreprise.image}
                  alt={entreprise.nom}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-xl">{entreprise.nom}</h3>
                      <p className="text-gray-500 text-sm">{entreprise.quartier}, {entreprise.ville}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-2xl font-bold text-orange-600">{entreprise.note}</span>
                        <span className="text-yellow-400 text-xl">★</span>
                      </div>
                      <p className="text-xs text-gray-500">({entreprise.nbAvis} avis)</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {entreprise.description}
                  </p>

                  <Link href="/entreprises" className="block text-center w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-2xl font-medium transition">
                    Voir les avis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Ajouter une entreprise */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Vous êtes une entreprise ?</h2>
          <p className="text-xl mb-8">Rejoignez AvisCI et soyez visible auprès de milliers de clients potentiels</p>
          <Link
            href="/ajouter"
            className="inline-block bg-white text-green-700 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition"
          >
            + Ajouter mon entreprise gratuitement
          </Link>
        </div>
      </section>
    </>
  );
}

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Star, TrendingUp, Shield, Users, ChevronRight, CheckCircle } from 'lucide-react';

const entreprises = [
  {
    id: 1,
    nom: "Maquis Le Bon Coin",
    categorie: "Restauration",
    ville: "Abidjan",
    quartier: "Cocody",
    note: 4.8,
    nbAvis: 124,
    description: "Meilleur attiéké et poulet braisé de Cocody. Ambiance chaleureuse.",
    emoji: "🍗",
    bg: "#FFF7ED",
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
    emoji: "💊",
    bg: "#ECFDF5",
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
    emoji: "🚗",
    bg: "#EFF6FF",
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
    emoji: "💇",
    bg: "#FDF2F8",
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
    emoji: "🏨",
    bg: "#FFFBEB",
  },
  {
    id: 6,
    nom: "Supermarché Bonprix",
    categorie: "Shopping",
    ville: "Abidjan",
    quartier: "Adjamé",
    note: 4.3,
    nbAvis: 98,
    description: "Large gamme de produits locaux et importés. Prix compétitifs.",
    emoji: "🛍️",
    bg: "#F5F3FF",
  },
];

const categories = [
  { nom: "Restauration", emoji: "🍴", href: "/entreprises?secteur=Restauration", color: "bg-orange-500" },
  { nom: "Santé", emoji: "🩺", href: "/entreprises?secteur=Santé", color: "bg-green-600" },
  { nom: "Automobile", emoji: "🚗", href: "/entreprises?secteur=Automobile", color: "bg-blue-600" },
  { nom: "Beauté", emoji: "💇", href: "/entreprises?secteur=Beauté", color: "bg-pink-500" },
  { nom: "Hôtellerie", emoji: "🏨", href: "/entreprises?secteur=Hôtellerie", color: "bg-amber-600" },
  { nom: "Shopping", emoji: "🛍️", href: "/entreprises?secteur=Shopping", color: "bg-purple-600" },
];

const stats = [
  { num: "12 450", label: "Avis vérifiés", color: "text-orange-600", icon: Star },
  { num: "2 380", label: "Entreprises", color: "text-green-600", icon: TrendingUp },
  { num: "28", label: "Quartiers couverts", color: "text-[#1B2B4B]", icon: MapPin },
  { num: "98%", label: "Satisfaction client", color: "text-orange-600", icon: Shield },
];

const avis = [
  {
    initiales: "KD",
    nom: "Kouamé David",
    date: "Il y a 2 jours",
    note: 5,
    texte: "Le service était impeccable. Je recommande vivement à tous ceux qui cherchent une bonne adresse à Cocody.",
    entreprise: "Maquis Le Bon Coin",
    emoji: "🍗",
    bg: "bg-orange-500",
  },
  {
    initiales: "AT",
    nom: "Aïcha Touré",
    date: "Il y a 5 jours",
    note: 5,
    texte: "Awa est une vraie artiste. Mes tresses sont parfaites et le salon est très propre. Prix raisonnables.",
    entreprise: "Coiffure Chez Awa",
    emoji: "💇",
    bg: "bg-green-600",
  },
  {
    initiales: "YB",
    nom: "Yves Brou",
    date: "Il y a 1 semaine",
    note: 4,
    texte: "Pharmacie très bien approvisionnée. Disponible même la nuit. Le personnel conseille bien.",
    entreprise: "Pharmacie de la Paix",
    emoji: "💊",
    bg: "bg-[#1B2B4B]",
  },
];

function EtoileNote({ note }: { note: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= note ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO SECTION */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a2a1a 50%, #1a0a00 100%)' }}
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,102,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,102,0,0.08) 1px, transparent 1px)',
            backgroundSize: '70px 70px',
          }} 
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20 pb-16">
          <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/30 mb-6 px-6 py-2 text-sm font-medium">
            🇨🇮 Plateforme d’avis n°1 en Côte d’Ivoire
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Les vraies expériences<br />à <span className="text-orange-500">Abidjan</span> et en CI
          </h1>

          <p className="text-white/70 text-xl max-w-2xl mx-auto mb-10">
            Avis vérifiés • Entreprises locales • Quartiers de confiance
          </p>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-2 shadow-2xl flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 px-6">
              <Search className="h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Maquis à Cocody, coiffeur à Yopougon, pharmacie..."
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-lg"
              />
            </div>
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 rounded-2xl px-10 text-white">
              Rechercher
            </Button>
          </div>

          {/* Tags rapides */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.nom}
                href={cat.href}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2 transition-all hover:scale-105"
              >
                <span className="text-xl">{cat.emoji}</span>
                {cat.nom}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <Card key={s.label} className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-3xl">
                <CardContent className="p-8 text-center">
                  <s.icon className={`mx-auto h-8 w-8 mb-3 ${s.color}`} />
                  <p className={`text-4xl font-bold mb-1 ${s.color}`}>{s.num}</p>
                  <p className="text-gray-600 font-medium">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section className="py-20 bg-[#F9F7F4]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-4xl font-bold text-gray-900">Explorez par catégorie</h2>
            <Link href="/entreprises" className="text-orange-600 font-semibold flex items-center gap-2 hover:underline">
              Voir tout <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.nom}
                href={cat.href}
                className={`${cat.color} text-white rounded-3xl p-8 text-center hover:scale-105 transition-all shadow-md hover:shadow-xl`}
              >
                <div className="text-5xl mb-4">{cat.emoji}</div>
                <p className="font-semibold text-lg">{cat.nom}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ENTREPRISES LES MIEUX NOTÉES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-4xl font-bold text-gray-900">Entreprises les mieux notées</h2>
            <Link href="/entreprises" className="text-orange-600 font-semibold flex items-center gap-2 hover:underline">
              Voir tout <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {entreprises.map((e) => (
              <Card key={e.id} className="rounded-3xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-2xl transition-all group">
                <div className="h-56 flex items-center justify-center text-7xl" style={{ backgroundColor: e.bg }}>
                  {e.emoji}
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors">{e.nom}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" /> {e.quartier}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-3xl font-bold text-orange-600">{e.note}</span>
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      </div>
                      <p className="text-xs text-gray-500">({e.nbAvis} avis)</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-6">{e.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" /> Vérifié
                      </Badge>
                      <Badge variant="outline" className="rounded-full">{e.categorie}</Badge>
                    </div>
                    <Button asChild size="sm" className="rounded-2xl bg-orange-600 hover:bg-orange-700">
                      <Link href={`/entreprises/${e.id}`}>Voir les avis</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DERNIERS AVIS */}
      <section className="py-20 bg-[#F9F7F4]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-4xl font-bold text-gray-900">Ce que disent nos clients</h2>
            <Link href="/entreprises" className="text-orange-600 font-semibold flex items-center gap-2 hover:underline">
              Voir tous les avis <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {avis.map((a) => (
              <Card key={a.nom} className="rounded-3xl bg-white p-7 shadow-sm hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`${a.bg} w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl`}>
                    {a.initiales}
                  </div>
                  <div>
                    <p className="font-semibold">{a.nom}</p>
                    <p className="text-xs text-gray-500">{a.date}</p>
                  </div>
                </div>

                <EtoileNote note={a.note} />

                <p className="mt-4 text-gray-700 leading-relaxed text-[15px]">
                  “{a.texte}”
                </p>

                <div className="mt-8 pt-6 border-t flex items-center gap-3 text-sm">
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="font-medium text-gray-700">{a.entreprise}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-green-700 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <Badge className="bg-white/20 text-white mb-6 px-5 py-2">
            <Users className="h-4 w-4 mr-2" /> Rejoignez plus de 2 380 entreprises
          </Badge>
          <h2 className="text-5xl font-bold text-white mb-6">Vous êtes une entreprise ?</h2>
          <p className="text-white/80 text-xl mb-10 max-w-lg mx-auto">
            Soyez visible auprès de milliers de clients à Abidjan et en Côte d’Ivoire
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-green-700 hover:bg-gray-100 text-xl px-12 py-7 rounded-3xl font-semibold shadow-2xl"
          >
            <Link href="/ajouter">+ Ajouter mon entreprise gratuitement</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
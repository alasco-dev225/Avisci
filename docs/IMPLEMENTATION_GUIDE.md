# Plan concret (React/Next.js + Supabase) pour AvisCI

## 1) Domaine + HTTPS (production)

### DNS
1. Acheter un domaine (ex: `avisci.ci` chez OVH/Namecheap).
2. Ajouter un `A record` vers `77.37.124.37`.
3. Ajouter `www` en `CNAME` vers `avisci.ci`.

### Reverse proxy + SSL (Nginx)
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

Créer `/etc/nginx/sites-available/avisci` :
```nginx
server {
  listen 80;
  server_name avisci.ci www.avisci.ci;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Puis :
```bash
sudo ln -s /etc/nginx/sites-available/avisci /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d avisci.ci -d www.avisci.ci
```

## 2) Correctifs fonctionnels inclus dans le code
- Responsive mobile/desktop.
- Recherche plus robuste (normalisation accents + recherche multi-champs).
- Filtres Ville + Quartier.
- Affichage badge de confiance locale.

## 3) Nouvelles features incluses
- Connexion téléphone + OTP SMS (Supabase Auth).
- Avis vocal (enregistrement navigateur + upload Supabase Storage).
- QR code direct vers formulaire avis (sans app).
- Gamification simple (XP local + niveaux contributeur).

## 4) Pré-requis Supabase
1. Exécuter le SQL : `supabase/migrations/2026-04-feature-pack-v2.sql`.
2. Dans Supabase Auth > Providers > Phone, activer OTP SMS.
3. Renseigner un provider SMS (Twilio, MessageBird, etc.) côté Supabase.
4. Vérifier que le bucket `reviews-audio` est public (lecture) et insert auth seulement.

## 5) Variables d'environnement
`.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 6) Déploiement app
```bash
npm ci
npm run build
npm run start
```

Conseil: lancer via PM2/systemd pour l'auto-restart.

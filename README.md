# Bac-Général

Site de révision gratuit pour le bac général (Terminale).

## 📁 Structure du projet

```
bac-general/
├── index.html                  # Page d'accueil
├── css/
│   └── style.css               # Styles globaux
├── js/
│   ├── main.js                 # JS page d'accueil
│   └── supabase-config.js      # Auth & helpers Supabase
├── pages/
│   ├── login.html              # Connexion
│   ├── register.html           # Inscription
│   ├── dashboard.html          # Espace élève
│   ├── fiches.html             # Fiches de cours
│   ├── qcm.html                # QCM
│   ├── annales.html            # Annales corrigées
│   ├── ressources.html         # Vidéos & liens
│   └── admin/
│       ├── dashboard.html      # Tableau de bord admin
│       ├── fiches.html         # Gestion des fiches
│       ├── qcm.html            # Gestion des QCM
│       ├── annales.html        # Gestion des annales
│       ├── ressources.html     # Gestion des ressources
│       ├── users.html          # Gestion des élèves
│       └── stats.html          # Statistiques
└── supabase-schema.sql         # Schéma base de données
```

## 🚀 Installation

### 1. Créer un projet Supabase
1. Crée un compte sur [supabase.com](https://supabase.com)
2. Crée un nouveau projet
3. Va dans **SQL Editor** et colle le contenu de `supabase-schema.sql`
4. Exécute le script

### 2. Configurer les clés API
Dans `js/supabase-config.js`, remplace :
```js
const SUPABASE_URL = 'https://VOTRE_PROJET.supabase.co';
const SUPABASE_ANON_KEY = 'VOTRE_ANON_KEY';
const ADMIN_EMAIL = 'ton@email.fr';
```
Les clés se trouvent dans **Supabase → Project Settings → API**.

### 3. Passer son compte en admin
Dans **Supabase → Table Editor → profiles**, trouve ton compte et change `role` en `admin`.

Ou via SQL :
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'ton@email.fr';
```

### 4. Déployer sur GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TON_PSEUDO/bac-general.git
git push -u origin main
```
Active **GitHub Pages** dans Settings → Pages → Source : `main`.

## 🔐 Sécurité
- Authentification gérée par Supabase Auth
- Row Level Security (RLS) activé sur toutes les tables
- L'accès admin est vérifié côté serveur via la table `profiles`

## 🛠 Technologies
- HTML / CSS / JavaScript pur
- [Supabase](https://supabase.com) (auth + base de données PostgreSQL)
- Hébergement : GitHub Pages

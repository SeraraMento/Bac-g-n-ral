# 🎓 Mon École — Plateforme Éducative

Site éducatif complet en **HTML/CSS/JS pur** + **Supabase** (Backend-as-a-Service).
Hébergé sur **GitHub Pages**.

---

## 📋 Fonctionnalités

### 👨‍🏫 Professeur
- Gérer ses matières enseignées
- Créer / modifier / supprimer des **devoirs** avec fichiers joints (PDF, DOC, images)
- Créer des **QCM** (correction automatique, notation automatique, tentative unique)
- Affecter des **notes** aux élèves
- Voir les **résultats QCM** par élève
- Ajouter des **événements** à l'agenda (calendrier + liste)
- Envoyer des **messages** à une classe ou un élève

### 👦 Élève
- Consulter ses **devoirs** (à faire / terminés) avec téléchargement de fichiers
- **Passer des QCM** (chronomètre, correction auto, note sur 20)
- Consulter ses **notes** (filtrées par matière, moyenne générale)
- Voir l'**agenda** (calendrier + liste)
- Recevoir et lire ses **messages**

### 🔐 Administrateur
- Tableau de bord avec statistiques
- **Créer / désactiver / réactiver** des comptes (prof, élève)
- **Gérer les classes** (créer, affecter des élèves)
- **Assigner des professeurs** aux matières

---

## 🚀 Installation

### 1. Configurer Supabase

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Va dans **SQL Editor** et exécute tout le contenu de `schema-sql.sql`
3. Va dans **Authentication > Providers** — vérifie que Email est activé
4. Va dans **API Settings** — copie l'URL et la `sb_publishable anon` (clé publique)

### 2. Mettre à jour les fichiers JS

Ouvre `js/supabase-client.js` et remplace les valeurs :

```js
const SUPABASE_URL = "https://TON-PROJET.supabase.co";
const SUPABASE_KEY = "TON-CLE-PUBLIQUE-ANON";
```

### 3. Créer le premier compte Admin

Dans **Authentication > Add User** de Supabase :
- Email : `admin@monecole.local`
- Mot de passe : ton mot de passe

Ensuite, va dans **Table Editor > profiles** et crée un enregistrement :
- `id` : l'UUID de l'utilisateur créé ci-dessus
- `identifiant` : `admin`
- `nom` : `Administrateur`
- `prenom` : `Super`
- `role` : `admin`
- `disabled` : `false`

### 4. Héberger sur GitHub Pages

1. Crée un repo GitHub (ex: `mon-ecole`)
2. Push tous les fichiers
3. Va dans **Settings > Pages > Source** → Sélectionne `main` / `/(root)`
4. Ton site sera disponible sur `https://TON-GITHUB.github.io/mon-ecole/`

### 5. Première connexion

1. Va sur la page de connexion
2. Connecte-toi avec :
   - **Identifiant** : `admin`
   - **Mot de passe** : celui que tu as choisi dans Supabase

---

## 📁 Structure des fichiers

```
mon-ecole/
├── index.html              # Connexion
├── register.html           # Inscription
├── css/
│   └── style.css          # Styles globaux
├── js/
│   ├── supabase-client.js # Config Supabase
│   ├── utils.js           # Fonctions utilitaires
│   └── auth.js            # (intégré dans les pages)
├── prof/
│   ├── dashboard.html     # Accueil prof
│   ├── matieres.html      # Gestion matières
│   ├── devoirs.html      # Gestion devoirs
│   ├── qcm.html          # Création QCM
│   ├── notes.html        # Notes + résultats
│   ├── agenda.html       # Agenda
│   └── messages.html      # Messages
├── eleve/
│   ├── dashboard.html    # Accueil élève
│   ├── devoirs.html     # Devoirs
│   ├── qcm.html         # Passer QCM + résultats
│   ├── notes.html       # Consulter notes
│   ├── agenda.html      # Agenda
│   └── messages.html    # Messages
├── admin/
│   ├── dashboard.html       # Tableau de bord
│   ├── gestion-comptes.html # Comptes
│   ├── gestion-classes.html # Classes
│   └── gestion-matieres.html # Matières
└── schema-sql.sql       # Schéma complet Supabase
```

---

## ⚠️ Notes importantes

- **Identifiant** = login (ex: `jdupont2026`) → converti en `jdupont2026@monecole.local` (Supabase)
- Les fichiers joints aux devoirs sont stockés dans **Supabase Storage** (`devoirs_fichiers`)
- Les QCM ont une **tentative unique** par défaut (modifiable dans le code)
- La **désactivation** d'un compte (plutôt que suppression) préserve l'historique des notes

---

## 🎨 Personnalisation

Modifie `css/style.css` pour changer les couleurs principales :

```css
:root {
    --primary: #1e3a5f;      /* Couleur principale */
    --accent: #e67e22;       /* Accent */
    --success: #27ae60;       /* Succès */
    --danger: #e74c3c;        /* Erreur / Supprimer */
}
```

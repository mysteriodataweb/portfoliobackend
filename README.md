# Portfolio Backend - API

Backend API Express.js pour le portfolio Alfred MysterioWebData.

## Stack

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : PostgreSQL
- **Sécurité** : Helmet, CORS, Rate Limiting, JWT
- **Logs** : Morgan

## Installation

```bash
npm install
```

## Configuration

Le fichier `.env` doit contenir :

```env
PORT=3001
FRONTEND_URL=http://localhost:5173

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio
DB_USER=postgres
DB_PASSWORD=Alfred@77__77?

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
```

## Initialisation de la base de données

```bash
# Crée les tables et insère les données de test
npm run db:init
```

## Démarrage

```bash
# Développement (avec reload automatique)
npm run dev

# Production
npm start
```

## Endpoints publics

| Méthode | Route                         | Description                  |
| ------- | ----------------------------- | ---------------------------- |
| GET     | `/api/health`                 | Health check                 |
| GET     | `/api/projects`               | Liste des projets            |
| GET     | `/api/projects/featured`      | Projets mis en avant         |
| GET     | `/api/projects/category/:cat` | Filtrer par catégorie        |
| GET     | `/api/projects/:slug`         | Détail d'un projet           |
| GET     | `/api/blog`                   | Liste des articles           |
| GET     | `/api/blog/:slug`             | Détail d'un article          |
| GET     | `/api/skills`                 | Compétences & certifications |
| GET     | `/api/profile`                | Profil public                |
| GET     | `/api/cv`                     | URL du CV                    |
| POST    | `/api/contact`                | Envoyer un message           |
| POST    | `/api/auth/login`             | Connexion admin              |

## Endpoints admin (JWT requis)

| Méthode | Route                                  | Description                  |
| ------- | -------------------------------------- | ---------------------------- |
| GET     | `/api/admin/projects`                  | Liste tous les projets       |
| POST    | `/api/admin/projects`                  | Créer un projet              |
| PUT     | `/api/admin/projects/:id`              | Modifier un projet           |
| DELETE  | `/api/admin/projects/:id`              | Supprimer un projet          |
| GET     | `/api/admin/blog`                      | Liste tous les articles      |
| POST    | `/api/admin/blog`                      | Créer un article             |
| PUT     | `/api/admin/blog/:id`                  | Modifier un article          |
| DELETE  | `/api/admin/blog/:id`                  | Supprimer un article         |
| GET     | `/api/admin/skills`                    | Compétences & certifications |
| POST    | `/api/admin/skills/categories`         | Créer une catégorie          |
| PUT     | `/api/admin/skills/categories/:id`     | Modifier une catégorie       |
| DELETE  | `/api/admin/skills/categories/:id`     | Supprimer une catégorie      |
| POST    | `/api/admin/skills`                    | Ajouter une compétence       |
| PUT     | `/api/admin/skills/:id`                | Modifier une compétence      |
| DELETE  | `/api/admin/skills/:id`                | Supprimer une compétence     |
| POST    | `/api/admin/skills/certifications`     | Ajouter une certification    |
| PUT     | `/api/admin/skills/certifications/:id` | Modifier                     |
| DELETE  | `/api/admin/skills/certifications/:id` | Supprimer                    |
| GET     | `/api/admin/profile`                   | Profil complet               |
| PUT     | `/api/admin/profile`                   | Modifier le profil           |
| POST    | `/api/admin/upload/image`              | Upload d'image               |
| POST    | `/api/admin/upload/cv`                 | Upload du CV (PDF)           |

## Structure

```
server/
├── src/
│   ├── index.js              # Point d'entrée
│   ├── db.js                 # Connexion PostgreSQL
│   ├── init-db.js            # Initialisation BDD
│   ├── middleware/
│   │   └── auth.js           # Middleware JWT
│   ├── routes/
│   │   ├── projects.js       # Routes publiques projets
│   │   ├── blog.js           # Routes publiques blog
│   │   ├── skills.js         # Routes publiques compétences
│   │   ├── contact.js        # Formulaire contact
│   │   ├── profile.js        # Profil public
│   │   ├── cv.js             # CV public
│   │   ├── auth.js           # Login admin
│   │   └── admin/
│   │       ├── projects.js   # CRUD projets
│   │       ├── blog.js       # CRUD blog
│   │       ├── skills.js     # CRUD compétences
│   │       ├── profile.js    # CRUD profil
│   │       └── upload.js     # Upload images/CV
│   └── data/                 # Données statiques (ancien)
├── uploads/
│   ├── images/
│   ├── cv/
│   └── profile/
├── .env
└── package.json
```

## Pages admin

- `/admin/login` — Connexion
- `/admin` — Dashboard
- `/admin/projets` — Gestion des projets
- `/admin/blog` — Gestion des articles
- `/admin/competences` — Gestion des compétences
- `/admin/profil` — Édition du profil
- `/admin/cv` — Upload du CV

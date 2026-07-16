# Plan : Dashboard Admin pour Portfolio

## Vue d'ensemble

Créer un panneau d'administration complet permettant de gérer les profils, projets, blogs, compétences et CV, avec authentification JWT et stockage PostgreSQL.

---

## 1. Backend — Base de données PostgreSQL

**Nouvelle dépendance** : `pg` (client PostgreSQL natif)

**Fichier** : `server/src/db.js`

- Connexion à PostgreSQL via les variables d'env
- Fonction `query()` utilitaire pour exécuter les requêtes

**Fichier** : `server/src/init-db.js`

- Script d'initialisation de la base de données
- Création des tables :

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  short_description TEXT,
  full_description TEXT,
  image VARCHAR(500),
  tech_stack JSONB DEFAULT '[]',
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  date VARCHAR(10),
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  context TEXT,
  approach TEXT,
  results TEXT,
  challenges TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]',
  image VARCHAR(500),
  date VARCHAR(10),
  read_time VARCHAR(20),
  content TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE skill_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  color VARCHAR(100),
  sort_order INT DEFAULT 0
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES skill_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  level INT DEFAULT 0,
  sort_order INT DEFAULT 0
);

CREATE TABLE certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  org VARCHAR(255),
  year VARCHAR(10)
);

CREATE TABLE profile (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  photo VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  website_url VARCHAR(500),
  values_title VARCHAR(255),
  values JSONB DEFAULT '[]',
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE site_settings (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT
);
```

**Migration des données** : Script pour insérer les données existantes (de `src/data/*.js`) dans PostgreSQL.

---

## 2. Backend — Authentification

**Nouvelles dépendances** : `bcryptjs`, `jsonwebtoken`

**Variables d'env** :

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio
DB_USER=postgres
DB_PASSWORD=  (pas de mot de passe, authentification trust)
```

**Fichiers** :

- `server/src/middleware/auth.js` — Middleware JWT qui vérifie le token dans le header `Authorization: Bearer <token>`
- `server/src/routes/auth.js` — Routes :
  - `POST /api/auth/login` — Vérifie username/password, retourne un JWT
  - `GET /api/auth/me` — Vérifie si le token est valide

---

## 3. Backend — Routes CRUD (protégées par JWT)

**Routes à créer** (toutes préfixées par `/api/admin/` et protégées par le middleware auth) :

| Méthode            | Route                              | Description                                    |
| ------------------ | ---------------------------------- | ---------------------------------------------- |
| **Projets**        |                                    |                                                |
| GET                | `/api/admin/projects`              | Liste tous les projets (y compris non publiés) |
| POST               | `/api/admin/projects`              | Créer un projet                                |
| PUT                | `/api/admin/projects/:id`          | Modifier un projet                             |
| DELETE             | `/api/admin/projects/:id`          | Supprimer un projet                            |
| **Blog**           |                                    |                                                |
| GET                | `/api/admin/blog`                  | Liste tous les articles                        |
| POST               | `/api/admin/blog`                  | Créer un article                               |
| PUT                | `/api/admin/blog/:id`              | Modifier un article                            |
| DELETE             | `/api/admin/blog/:id`              | Supprimer un article                           |
| **Compétences**    |                                    |                                                |
| GET                | `/api/admin/skills`                | Liste catégories + compétences                 |
| POST               | `/api/admin/skills/categories`     | Créer une catégorie                            |
| PUT                | `/api/admin/skills/categories/:id` | Modifier une catégorie                         |
| DELETE             | `/api/admin/skills/categories/:id` | Supprimer une catégorie                        |
| POST               | `/api/admin/skills`                | Ajouter une compétence                         |
| PUT                | `/api/admin/skills/:id`            | Modifier une compétence                        |
| DELETE             | `/api/admin/skills/:id`            | Supprimer une compétence                       |
| **Certifications** |                                    |                                                |
| POST               | `/api/admin/certifications`        | Ajouter                                        |
| PUT                | `/api/admin/certifications/:id`    | Modifier                                       |
| DELETE             | `/api/admin/certifications/:id`    | Supprimer                                      |
| **CV**             |                                    |                                                |
| GET                | `/api/cv`                          | Télécharger le CV (public)                     |
| POST               | `/api/admin/cv`                    | Upload du CV (PDF)                             |
| **Profil**         |                                    |                                                |
| GET                | `/api/profile`                     | Récupérer le profil (public, sans auth)        |
| PUT                | `/api/admin/profile`               | Modifier le profil (auth requise)              |
| **Upload images**  |                                    |                                                |
| POST               | `/api/admin/upload`                | Upload d'image                                 |

**Fichiers** :

- `server/src/routes/admin/projects.js`
- `server/src/routes/admin/blog.js`
- `server/src/routes/admin/skills.js`
- `server/src/routes/admin/cv.js`
- `server/src/routes/admin/profile.js`
- `server/src/routes/admin/upload.js`

---

## 4. Backend — Upload & Fichiers statiques

**Nouvelle dépendance** : `multer`

**Configuration** :

- Dossier `/uploads` à la racine du serveur
- Sous-dossiers : `/uploads/images/`, `/uploads/cv/`, `/uploads/profile/`
- Servir les fichiers statiques via Express : `app.use('/uploads', express.static('uploads'))`
- Limites : images max 5 Mo, CV max 10 Mo, uniquement `.pdf` pour le CV

---

## 5. Frontend — Page de Login

---

## 5. Frontend — Page de Login

**Fichier** : `portfolio/src/pages/admin/LoginPage.tsx`

- Formulaire username + password
- Appel à `POST /api/auth/login`
- Stockage du JWT dans `localStorage`
- Redirection vers `/admin` en cas de succès
- Style cohérent avec le design existant (dark theme, glassmorphism)

---

## 6. Frontend — Layout Admin

**Fichier** : `portfolio/src/components/admin/AdminLayout.tsx`

- Sidebar avec navigation : Projets, Blog, Compétences, Profil, CV
- Header avec bouton "Voir le site" et "Déconnexion"
- Protège les routes : redirige vers `/admin/login` si pas de token

---

## 7. Frontend — Pages Admin

**Fichiers dans** `portfolio/src/pages/admin/` :

| Fichier                 | Description                                                                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DashboardPage.tsx`     | Vue d'ensemble (nombre de projets, articles, etc.)                                                                                                                                      |
| `ProjectsAdminPage.tsx` | Liste des projets + bouton "Nouveau"                                                                                                                                                    |
| `ProjectFormPage.tsx`   | Formulaire de création/édition de projet                                                                                                                                                |
| `BlogAdminPage.tsx`     | Liste des articles + bouton "Nouveau"                                                                                                                                                   |
| `BlogFormPage.tsx`      | Formulaire de création/édition d'article                                                                                                                                                |
| `SkillsAdminPage.tsx`   | Gestion des catégories, compétences, certifications                                                                                                                                     |
| `ProfileAdminPage.tsx`  | Édition du profil : nom complet, titre, bio, photo, email, téléphone, localisation, liens sociaux (GitHub, LinkedIn, Twitter, site web), titre des valeurs, liste des valeurs/principes |
| `CVAdminPage.tsx`       | Upload du CV PDF + preview                                                                                                                                                              |

---

## 8. Frontend — Hooks API Admin

**Fichiers dans** `portfolio/src/hooks/` :

| Fichier                 | Hooks                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `use-admin-auth.ts`     | `useLogin()`, `useLogout()`, `useAuth()`                                               |
| `use-admin-projects.ts` | `useAdminProjects()`, `useCreateProject()`, `useUpdateProject()`, `useDeleteProject()` |
| `use-admin-blog.ts`     | `useAdminBlog()`, `useCreatePost()`, `useUpdatePost()`, `useDeletePost()`              |
| `use-admin-skills.ts`   | `useAdminSkills()`, CRUD pour catégories/compétences/certifications                    |
| `use-admin-profile.ts`  | `useProfile()`, `useUpdateProfile()`                                                   |
| `use-admin-cv.ts`       | `useUploadCV()`, `useCVInfo()`                                                         |

---

## 9. Routes Frontend

Ajouter dans `App.tsx` :

```
/admin/login          → LoginPage
/admin                → AdminLayout (protégé)
/admin                → DashboardPage
/admin/projets        → ProjectsAdminPage
/admin/projets/new    → ProjectFormPage
/admin/projets/:id    → ProjectFormPage
/admin/blog           → BlogAdminPage
/admin/blog/new       → BlogFormPage
/admin/blog/:id       → BlogFormPage
/admin/competences    → SkillsAdminPage
/admin/profil         → ProfileAdminPage
/admin/cv             → CVAdminPage
```

---

## 10. Fichiers à modifier

| Fichier                               | Modification                                                                                                          |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `server/package.json`                 | Ajouter : `pg`, `bcryptjs`, `jsonwebtoken`, `multer`                                                                  |
| `server/.env`                         | Ajouter : `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` |
| `server/src/index.js`                 | Ajouter : middleware static `/uploads`, routes admin, route auth, route profile                                       |
| `portfolio/src/App.tsx`               | Ajouter : routes admin                                                                                                |
| `portfolio/src/api/client.ts`         | Ajouter : header Authorization automatique                                                                            |
| `portfolio/src/components/Header.tsx` | Ajouter : lien admin (optionnel)                                                                                      |

---

## 11. Résumé des nouvelles dépendances

**Backend** :

- `pg` — Client PostgreSQL
- `bcryptjs` — Hashage des mots de passe
- `jsonwebtoken` — Gestion JWT
- `multer` — Upload de fichiers

**Frontend** :

- Aucune nouvelle dépendance (shadcn/ui a déjà tout : Dialog, Form, Table, Tabs, etc.)

---

## 12. Ordre d'implémentation

1. Base de données PostgreSQL + schéma + migration
2. Authentification (login, JWT, middleware)
3. Routes CRUD backend (projets, blog, skills, certifications, profil)
4. Upload images + CV
5. Page login frontend
6. Layout admin + navigation
7. Pages admin (projets, blog, skills, profil, CV)
8. Hooks API admin
9. Intégration et tests

Termine. Voici les changements :

1. Couleurs de texte corrigees - Les messages sont maintenant en noir #171717 au lieu de gris, plus lisible.
2. Notifications email - Tu recois un email a fredbiam9@gmail.com quand quelqu'un envoie un message via /contact.
   Pour activer les emails, tu dois configurer un Mot de passe d'application Gmail :
3. Va sur https://myaccount.google.com/apppasswords
4. Genere un nouveau mot de passe pour "Portfolio"
5. Copie le mot de passe dans server/.env :
   EMAIL_PASS=xxxx xxxx xxxx xxxx
6. Redemarre le serveur : cd server && npm run dev
   Format de l'email recu :

- Expediteur : fredbiam9@gmail.com
- Sujet : [Portfolio] Sujet du message
- Corps : Nom, email, sujet, message du visiteur
- Reponse directe : clique "Repondre" pour repondre au visiteur

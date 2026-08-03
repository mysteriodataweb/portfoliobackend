-- Migration portfolio vers Supabase
-- Genere le 2026-07-16T03:14:56.749Z

-- Schema

CREATE TABLE IF NOT EXISTS projects (
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
  archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMP,
  context TEXT,
  approach TEXT,
  results TEXT,
  challenges TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
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
  archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  color VARCHAR(100),
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES skill_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  level INT DEFAULT 0,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  org VARCHAR(255),
  year VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profile (
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

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Donnees projects
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (1, 'prediction-churn-ml', 'Prédiction de Churn Client', 'data-science', 'Modèle ML prédisant le churn avec 94% de précision via XGBoost et feature engineering avancé.', 'Développement d''un pipeline complet de machine learning pour prédire la perte de clients pour une entreprise SaaS B2B.', '/images/project-ds-1.jpg', '["Python","XGBoost","Pandas","Scikit-learn","Docker"]', 'https://github.com', NULL, '2025-12', true, true, 'Une entreprise SaaS perdait 15% de ses clients chaque trimestre.', 'Pipeline ETL avec Pandas, feature engineering avancé, comparaison de 5 algorithmes.', 'Le modèle XGBoost final atteint 94% de précision et 0.91 AUC-ROC.', 'Le déséquilibre des classes nécessitait des techniques SMOTE.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (2, 'ecommerce-platform', 'Plateforme E-commerce Moderne', 'fullstack', 'Application e-commerce complète avec React, Node.js, Stripe et gestion d''inventaire en temps réel.', 'Plateforme e-commerce fullstack avec panier, paiements Stripe, dashboard admin.', '/images/project-fs-1.jpg', '["React","TypeScript","Node.js","PostgreSQL","Stripe","Redis"]', 'https://github.com', 'https://demo.example.com', '2025-10', true, true, 'Un client souhaitait migrer sa boutique en ligne.', 'Architecture microservices avec React frontend, API Node.js/Express.', 'Temps de chargement < 1.5s, conversion +35%.', 'La gestion d''inventaire temps réel avec WebSockets.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (3, 'chatbot-ia-support', 'Chatbot IA Support Client', 'hybrid', 'Chatbot intelligent utilisant GPT-4 et RAG pour automatiser 70% du support client.', 'Système de chatbot avec retrieval-augmented generation.', '/images/project-ai-1.jpg', '["Python","LangChain","OpenAI","React","FastAPI","Pinecone"]', 'https://github.com', 'https://demo.example.com', '2025-08', true, true, 'L''équipe support recevait 500+ tickets/jour.', 'Architecture RAG avec Pinecone, LangChain pour l''orchestration.', '70% des tickets résolus automatiquement.', 'Le fine-tuning du prompt engineering pour éviter les hallucinations.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (4, 'dashboard-analytics-temps-reel', 'Dashboard Analytics Temps Réel', 'hybrid', 'Dashboard de monitoring avec visualisations D3.js, WebSockets et alertes automatisées.', 'Plateforme de monitoring et analytics temps réel.', '/images/project-hybrid-1.jpg', '["React","D3.js","WebSocket","Python","InfluxDB","Grafana"]', 'https://github.com', NULL, '2025-06', true, true, 'Une startup fintech avait besoin d''un dashboard unifié.', 'Frontend React avec D3.js, backend Python, InfluxDB, WebSockets.', 'Détection d''incidents 5x plus rapide.', 'Gérer le volume de données (10K+ events/seconde).', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (5, 'nlp-analyse-sentiment', 'Analyse de Sentiment NLP', 'data-science', 'Pipeline NLP analysant le sentiment de 100K+ avis clients avec BERT fine-tuné.', 'Système d''analyse de sentiment multilingue basé sur des transformers.', '/images/project-ds-2.jpg', '["Python","PyTorch","HuggingFace","SpaCy","FastAPI","AWS"]', 'https://github.com', NULL, '2025-04', false, true, 'Une marque de cosmétiques voulait analyser les avis.', 'Fine-tuning d''un modèle BERT multilingue sur 50K avis.', 'Accuracy de 92% sur le sentiment.', 'La gestion du sarcasme et de l''ironie.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (6, 'task-management-app', 'App Gestion de Projets', 'fullstack', 'Application Kanban collaborative avec drag & drop, notifications temps réel.', 'Outil de gestion de projets agile avec tableaux Kanban.', '/images/project-fs-2.jpg', '["React","TypeScript","Supabase","TailwindCSS","DnD Kit"]', 'https://github.com', 'https://demo.example.com', '2025-02', false, true, 'L''équipe avait besoin d''un outil de gestion léger.', 'Frontend React avec DnD Kit, Supabase pour le backend temps réel.', 'Réduction de 30% du temps en réunions.', 'La synchronisation optimiste de l''état.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (8, 'africa-kpis-dashboard', 'Dashboard Indicateurs Africains', 'fullstack', 'Pipeline data + dashboard interactif pour les indicateurs de développement du World Bank API.', 'Extraction, nettoyage et visualisation des indicateurs de développement africains via l''API World Bank.', '/images/project-africa-kpis.jpg', '["Python","DuckDB","Next.js","Plotly","TailwindCSS","shadcn/ui"]', 'https://github.com/mysteriodataweb/African_Countries_KPIS_Analysis', NULL, '2026-07', true, true, 'Besoin de visualiser les données de développement pour l''Afrique.', 'Pipeline Python + DuckDB, dashboard Next.js avec Plotly.', 'Dashboard interactif avec 50+ indicateurs pour 54 pays africains.', 'Gestion de gros volumes de données World Bank API.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (9, 'innopro-gestion-maintenance', 'InnoPro : Gestion Maintenance & Production', 'fullstack', 'Application fullstack enterprise avec auth JWT, builder drag & drop, et intégration GROQ AI.', 'Système complet de gestion de la maintenance et production avec modules JWT, form builder, et IA.', '/images/project-innopro.jpg', '["Node.js","Express","PostgreSQL","React","GROQ AI","TailwindCSS"]', 'https://github.com/mysteriodataweb/innopro', NULL, '2026-06', true, true, 'Une entreprise avait besoin d''un système de gestion maintenance.', 'Backend Node.js/Express, frontend React, 13 migrations PostgreSQL, intégration GROQ API.', 'Réduction de 40% du temps de gestion administrative.', 'Intégration d''IA pour la génération automatique de formulaires.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (10, 'ftth-prediction-togo', 'Prédiction Accès Fibre Optique - Togo', 'data-science', 'ML prédisant l''accès FTTH avec données géospatiales MOSAIKS et modèles XGBoost/LightGBM.', 'Modèle de prédiction de l''accès fibre optique basé sur des données socio-démographiques et 4000 features géospatiales.', '/images/project-ftth-togo.jpg', '["Python","XGBoost","LightGBM","SHAP","MOSAIKS","Parquet"]', 'https://github.com/mysteriodataweb/ACDS_FBER_ACCESS_PRED', NULL, '2026-05', false, true, 'Prédire le potentiel d''accès fibre pour les ménages togolais.', 'Feature engineering géospatial avec MOSAIKS, comparaison de 6 modèles.', 'Modèle LightGBM avec 89% de précision, interprétabilité SHAP.', 'Gestion de 2.2GB de données géospatiales.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (11, 'dataviz-energie-afrique', 'DataViz Énergie Afrique', 'data-science', 'Web scraping + Power BI pour l''analyse de la production énergétique africaine.', 'Pipeline de scraping de données énergétiques avec visualisation Power BI.', '/images/project-dataviz-energie.jpg', '["Python","Power BI","Web Scraping","Pandas","Matplotlib"]', 'https://github.com/mysteriodataweb/Dataviz_africitizen_project', NULL, '2026-04', false, true, 'Analyser la production énergétique des pays africains.', 'Scraper Python pour Our World in Data, analyse exploratoire, dashboard Power BI.', 'Dashboard interactif couvrant 20+ pays africains.', 'Nettoyage de données hétérogènes de sources multiples.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (12, 'fake-news-detection-nlp', 'Détection Fake News par NLP', 'data-science', 'Classification de fake news avec techniques NLP et modèles de ML.', 'Système de détection de fausses nouvelles basé sur le traitement du langage naturel.', '/images/project-fake-news.jpg', '["Python","NLP","Scikit-learn","NLTK","TF-IDF"]', 'https://github.com/mysteriodataweb/NLP_Project_Fake_News_Detection', NULL, '2026-05', false, true, 'Lutter contre la désinformation via l''IA.', 'Pipeline NLP avec TF-IDF, comparaison de classifiers.', 'Accuracy de 94% sur le dataset de test.', 'Gestion du déséquilibre des classes et du bruit textuel.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:23:51.445Z"') ON CONFLICT DO NOTHING;
INSERT INTO projects (id, slug, title, category, short_description, full_description, image, tech_stack, github_url, demo_url, date, featured, published, context, approach, results, challenges, created_at, updated_at) VALUES (7, 'ml-portfolio-11-projects', 'Portfolio ML : 11 Projets Data Science', 'data-science', 'Collection de 11 projets ML couvrant NLP, Deep Learning, Time Series, LLMs et Vector Search.', 'Portfolio complet de 11 projets machine learning démontrant l''ensemble du cycle de vie ML, du feature engineering au déploiement.', 'https://tse1.mm.bing.net/th/id/OIP.6AznVryX779cnhPyL8vCbgHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', '["Python","TensorFlow","PyTorch","HuggingFace","Pinecone","scikit-learn"]', 'https://github.com/mysteriodataweb/ML_Datascience_AI_Projects', '', '2026-07', true, NULL, 'Démontrer une expertise complète en Data Science et ML à travers des projets réels.', '11 projets documentés avec CI/CD, pre-commit hooks, et code production-ready.', 'Portfolio reconnu comme référence pour les data scientists junior.', 'Coordonner 11 projets avec des stacks différentes.', '"2026-07-15T06:23:51.445Z"', '"2026-07-15T06:54:36.341Z"') ON CONFLICT DO NOTHING;

-- Donnees blog_posts
INSERT INTO blog_posts (id, slug, title, excerpt, category, tags, image, date, read_time, content, published, created_at, updated_at) VALUES (1, 'comprendre-transformers-attention', 'Comprendre les Transformers : Le Mécanisme d''Attention Expliqué', 'Une plongée en profondeur dans le mécanisme d''attention.', 'IA/ML', '["Transformers","NLP","Deep Learning","Attention"]', '/images/blog-cover-1.jpg', '2025-12-15', '8 min', '## Introduction

Les Transformers ont révolutionné le NLP.', true, '"2026-07-15T06:23:51.457Z"', '"2026-07-15T06:23:51.457Z"') ON CONFLICT DO NOTHING;
INSERT INTO blog_posts (id, slug, title, excerpt, category, tags, image, date, read_time, content, published, created_at, updated_at) VALUES (2, 'react-server-components-guide', 'React Server Components : Guide Pratique pour 2025', 'Comment tirer parti des React Server Components.', 'Fullstack', '["React","Server Components","Performance","Next.js"]', '/images/blog-cover-2.jpg', '2025-11-28', '6 min', '## Pourquoi les Server Components ?', true, '"2026-07-15T06:23:51.457Z"', '"2026-07-15T06:23:51.457Z"') ON CONFLICT DO NOTHING;
INSERT INTO blog_posts (id, slug, title, excerpt, category, tags, image, date, read_time, content, published, created_at, updated_at) VALUES (3, 'pipeline-donnees-moderne', 'Construire un Pipeline de Données Moderne en 2025', 'Architecture et outils pour un pipeline data robuste.', 'Data Science', '["Data Engineering","ETL","Pipeline","Airflow","dbt"]', '/images/blog-cover-3.jpg', '2025-11-10', '10 min', '## L''Évolution des Pipelines Data', true, '"2026-07-15T06:23:51.457Z"', '"2026-07-15T06:23:51.457Z"') ON CONFLICT DO NOTHING;

-- Donnees skill_categories
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (1, 'Langages', 'Code2', 'primary', 1) ON CONFLICT DO NOTHING;
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (2, 'Data Science & ML', 'Brain', 'accent-purple', 2) ON CONFLICT DO NOTHING;
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (3, 'AI & Generative AI', 'Sparkles', 'accent-orange', 3) ON CONFLICT DO NOTHING;
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (4, 'Frontend', 'Monitor', 'accent-cyan', 4) ON CONFLICT DO NOTHING;
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (5, 'Backend & DevOps', 'Server', 'accent-blue', 5) ON CONFLICT DO NOTHING;
INSERT INTO skill_categories (id, name, icon, color, sort_order) VALUES (6, 'Data Analysis & Visualisation', 'BarChart3', 'accent-green', 6) ON CONFLICT DO NOTHING;

-- Donnees skills
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (1, 1, 'Python', 95, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (2, 1, 'TypeScript', 90, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (3, 1, 'JavaScript', 90, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (4, 1, 'SQL', 88, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (5, 1, 'R', 70, 5) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (6, 1, 'Jupyter', 85, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (7, 2, 'Pandas / NumPy', 95, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (8, 2, 'Scikit-learn', 92, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (9, 2, 'PyTorch', 85, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (10, 2, 'TensorFlow', 80, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (11, 2, 'XGBoost / LightGBM', 88, 5) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (12, 2, 'MLOps', 75, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (13, 2, 'SHAP', 80, 7) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (14, 2, 'Feature Engineering', 82, 8) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (15, 3, 'OpenAI / GPT API', 85, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (16, 3, 'HuggingFace Transformers', 82, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (17, 3, 'LangChain / LLM Orchestration', 78, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (18, 3, 'RAG (Retrieval Augmented Generation)', 80, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (19, 3, 'Prompt Engineering', 85, 5) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (20, 3, 'Pinecone / Vector DB', 75, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (21, 3, 'GROQ AI', 72, 7) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (22, 3, 'Stable Diffusion', 68, 8) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (23, 4, 'React', 92, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (24, 4, 'Next.js', 85, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (25, 4, 'TailwindCSS', 90, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (26, 4, 'Framer Motion', 78, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (27, 4, 'D3.js / Plotly', 78, 5) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (28, 4, 'shadcn/ui', 82, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (29, 4, 'Vue.js', 65, 7) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (30, 5, 'Node.js', 88, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (31, 5, 'FastAPI', 85, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (32, 5, 'PostgreSQL', 88, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (33, 5, 'Docker', 82, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (34, 5, 'DuckDB', 78, 5) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (35, 5, 'CI/CD', 80, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (36, 5, 'AWS / Cloud', 75, 7) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (37, 5, 'Git / GitHub Actions', 85, 8) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (38, 6, 'Pandas / NumPy', 95, 1) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (39, 6, 'Matplotlib / Seaborn', 88, 2) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (40, 6, 'Plotly / Dash', 82, 3) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (41, 6, 'Power BI', 78, 4) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (43, 6, 'Statistique & Inference Causale', 85, 6) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (44, 6, 'Data Storytelling', 82, 7) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (45, 6, 'EDA (Exploratory Data Analysis)', 88, 8) ON CONFLICT DO NOTHING;
INSERT INTO skills (id, category_id, name, level, sort_order) VALUES (42, NULL, 'Excel / Google Sheets', 80, 0) ON CONFLICT DO NOTHING;

-- Donnees certifications
INSERT INTO certifications (id, name, org, year) VALUES (1, 'AWS Certified Cloud Practitioner', 'Amazon Web Services', '2024') ON CONFLICT DO NOTHING;
INSERT INTO certifications (id, name, org, year) VALUES (2, 'TensorFlow Developer Certificate', 'Google', '2024') ON CONFLICT DO NOTHING;
INSERT INTO certifications (id, name, org, year) VALUES (3, 'Data Science Professional', 'IBM', '2023') ON CONFLICT DO NOTHING;

-- Donnees profile
INSERT INTO profile (id, full_name, title, bio, photo, email, phone, location, github_url, linkedin_url, twitter_url, website_url, values_title, values, updated_at) VALUES (1, 'Alfred MysterioWebData', 'Data Scientist & Fullstack Developer', 'Passionné par la data science et le développement web, je crée des solutions innovantes alliant IA et performance.', NULL, 'contact@example.com', NULL, NULL, 'https://github.com', 'https://linkedin.com', NULL, NULL, 'Mes Valeurs', '["Innovation continue","Qualité du code","Impact mesurable"]', '"2026-07-15T06:23:51.475Z"') ON CONFLICT DO NOTHING;

-- Donnees admin_users
INSERT INTO admin_users (id, username, password_hash) VALUES (1, 'admin', '$2b$10$1nGCgEAtzriqWN.xil2tWOI1kwciX25HQAm2StFEBer6j0ke/B1Mq') ON CONFLICT DO NOTHING;

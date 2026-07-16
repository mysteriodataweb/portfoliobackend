export const blogPosts = [
  {
    id: "1",
    slug: "comprendre-transformers-attention",
    title: "Comprendre les Transformers : Le Mécanisme d'Attention Expliqué",
    excerpt: "Une plongée en profondeur dans le mécanisme d'attention qui a révolutionné le NLP et l'IA générative.",
    category: "IA/ML",
    tags: ["Transformers", "NLP", "Deep Learning", "Attention"],
    image: "/images/blog-cover-1.jpg",
    date: "2025-12-15",
    readTime: "8 min",
    content: `## Introduction

Les Transformers ont révolutionné le traitement du langage naturel depuis leur introduction dans le papier "Attention Is All You Need" en 2017. Mais comment fonctionne réellement le mécanisme d'attention au cœur de cette architecture ?

## Le Problème des RNN

Avant les Transformers, les réseaux récurrents (RNN, LSTM, GRU) dominaient le NLP. Leur principal défaut : le traitement séquentiel empêchait la parallélisation et les dépendances longue distance se perdaient au fil de la séquence.

## Self-Attention : L'Idée Clé

Le mécanisme de self-attention permet à chaque token d'une séquence de "regarder" tous les autres tokens simultanément. Pour chaque mot, on calcule :

- **Query (Q)** : Ce que le mot cherche
- **Key (K)** : Ce que le mot offre comme information
- **Value (V)** : L'information réelle du mot

La formule d'attention est :

\`Attention(Q, K, V) = softmax(QK^T / √d_k) × V\`

## Multi-Head Attention

Au lieu d'un seul calcul d'attention, les Transformers utilisent plusieurs "têtes" en parallèle. Chaque tête apprend à capturer différents types de relations : syntaxiques, sémantiques, positionnelles, etc.

## Applications Modernes

Cette architecture est à la base de :
- **GPT** : Génération de texte auto-régressive
- **BERT** : Compréhension bidirectionnelle du langage
- **Vision Transformers** : Application à la vision par ordinateur
- **Modèles multimodaux** : Combinant texte, image et audio

## Conclusion

Comprendre les Transformers est essentiel pour tout data scientist travaillant avec l'IA moderne. Le mécanisme d'attention est élégant dans sa simplicité et puissant dans ses applications.`,
  },
  {
    id: "2",
    slug: "react-server-components-guide",
    title: "React Server Components : Guide Pratique pour 2025",
    excerpt: "Comment tirer parti des React Server Components pour des applications web ultra-performantes.",
    category: "Fullstack",
    tags: ["React", "Server Components", "Performance", "Next.js"],
    image: "/images/blog-cover-2.jpg",
    date: "2025-11-28",
    readTime: "6 min",
    content: `## Pourquoi les Server Components ?

Les React Server Components (RSC) représentent un changement de paradigme. Ils permettent de rendre des composants côté serveur sans envoyer leur JavaScript au client.

## Avantages Clés

- **Bundle size réduit** : Le code serveur n'est jamais envoyé au navigateur
- **Accès direct aux données** : Requêtes DB sans API intermédiaire
- **Streaming** : Rendu progressif pour une meilleure UX
- **SEO natif** : Contenu HTML complet dès le premier rendu

## Quand Utiliser Client vs Server

### Server Components (par défaut)
- Affichage de données statiques
- Accès aux ressources backend
- Composants sans interactivité

### Client Components
- Gestion d'état (useState, useEffect)
- Event handlers (onClick, onChange)
- APIs navigateur (localStorage, etc.)

## Patterns Recommandés

Le pattern le plus efficace est de garder les Server Components en haut de l'arbre et de pousser les Client Components vers les feuilles.

## Conclusion

Les RSC ne remplacent pas les composants classiques, ils les complètent pour une architecture optimale.`,
  },
  {
    id: "3",
    slug: "pipeline-donnees-moderne",
    title: "Construire un Pipeline de Données Moderne en 2025",
    excerpt: "Architecture et outils pour un pipeline data robuste : de l'ingestion à la visualisation.",
    category: "Data Science",
    tags: ["Data Engineering", "ETL", "Pipeline", "Airflow", "dbt"],
    image: "/images/blog-cover-3.jpg",
    date: "2025-11-10",
    readTime: "10 min",
    content: `## L'Évolution des Pipelines Data

Les pipelines de données ont considérablement évolué. Fini les scripts cron fragiles et les ETL monolithiques. En 2025, on construit des pipelines modulaires, testables et observables.

## Architecture Moderne

### Ingestion
- **Sources** : APIs, bases de données, fichiers, streams
- **Outils** : Airbyte, Fivetran, ou scripts custom
- **Pattern** : ELT plutôt qu'ETL

### Transformation
- **dbt** : SQL-based transformations avec tests et documentation
- **Spark/Polars** : Pour les gros volumes
- **Great Expectations** : Validation de la qualité des données

### Orchestration
- **Airflow** ou **Dagster** pour le scheduling
- **DAGs** bien documentés
- **Alerting** sur les échecs

### Stockage
- **Data Warehouse** : BigQuery, Snowflake, Redshift
- **Data Lake** : S3 + format Parquet/Delta

### Visualisation
- **Metabase**, **Superset**, ou **Looker**
- Dashboards self-service pour les équipes métier

## Bonnes Pratiques

1. **Idempotence** : Chaque étape peut être rejouée
2. **Tests** : Unitaires sur les transformations, intégration sur le pipeline
3. **Monitoring** : Alertes sur la fraîcheur et la qualité des données
4. **Documentation** : Catalogue de données avec lineage

## Conclusion

Un bon pipeline data est invisible quand il fonctionne et facile à debugger quand il casse.`,
  },
];

export const getBlogPostBySlug = (slug) => blogPosts.find((p) => p.slug === slug);

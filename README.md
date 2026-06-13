# Jumeau Numérique — District Ankazohabo
**Matsiatra Ambony · Madagascar**

Système de gestion et de visualisation numérique du district d'Ankazohabo.

---

## Structure du projet

```
jumeau-numerique-ankazohabo/
├── frontend/
│   └── index.html          ← Application web (ouvrir dans un navigateur)
├── backend/
│   ├── src/
│   │   ├── server.js       ← API Express (Node.js)
│   │   ├── config/database.js
│   │   ├── controllers/
│   │   │   ├── batimentsController.js
│   │   │   └── districtController.js
│   │   └── routes/api.js
│   ├── package.json
│   └── .env
├── database/
│   ├── migrate.js          ← Création des tables
│   └── seed.js             ← Données initiales Ankazohabo
└── docs/
```

---

## Lancement rapide

### Frontend autonome (aucune installation)
```bash
# Ouvrir directement dans le navigateur :
open frontend/index.html
```

### Backend API
```bash
cd backend
npm install
node database/migrate.js   # Créer la base de données
node database/seed.js      # Charger les données Ankazohabo
npm run dev                # Démarrer l'API sur http://localhost:3001
```

---

## Fonctionnalités (v1.0)

### Vue Carte (Leaflet.js)
- Carte interactive avec tous les bâtiments géolocalisés
- Code couleur par type d'usage
- Popup détaillé par bâtiment (matériaux, état, superficie, etc.)
- Capteurs IoT positionnés sur la carte
- Filtres par usage (résidentiel, éducation, santé, etc.)

### Vue 3D isométrique
- Rendu 3D canvas des bâtiments avec hauteur réelle
- Hauteurs proportionnelles aux données terrain
- Filtrage dynamique

### Analytique (Charts.js)
- Répartition des bâtiments par usage
- Distribution de l'état du bâti
- Accès eau & électricité par quartier
- Évolution démographique 2015–2024
- Courbe de température temps réel

### Liste bâtiments
- Tableau complet avec recherche full-text
- 57 bâtiments référencés

### Tableau de bord
- Capteurs IoT avec simulation temps réel (mise à jour toutes 4 s)
- KPIs district (bâtiments, population, taux d'électrification, accès eau)
- Alertes actives (fuite réseau, surveillance inondation)
- Projets urbains en cours

---

## API REST (backend)

| Méthode | Endpoint                        | Description                  |
|---------|---------------------------------|------------------------------|
| GET     | /api/v1/dashboard               | KPIs et données agrégées     |
| GET     | /api/v1/district                | Infos district + quartiers   |
| GET     | /api/v1/batiments               | Liste des bâtiments          |
| GET     | /api/v1/batiments/stats         | Statistiques bâtiments       |
| GET     | /api/v1/batiments/:id           | Détail d'un bâtiment         |
| POST    | /api/v1/batiments               | Ajouter un bâtiment          |
| PUT     | /api/v1/batiments/:id           | Modifier un bâtiment         |
| DELETE  | /api/v1/batiments/:id           | Supprimer un bâtiment        |
| GET     | /api/v1/capteurs                | Liste des capteurs IoT       |
| GET     | /api/v1/releves?days=7          | Relevés capteurs             |
| POST    | /api/v1/releves                 | Enregistrer un relevé        |
| GET     | /api/v1/alertes                 | Liste des alertes            |
| POST    | /api/v1/alertes                 | Créer une alerte             |
| PATCH   | /api/v1/alertes/:id/resolve     | Résoudre une alerte          |
| GET     | /api/v1/projets                 | Projets urbains              |
| POST    | /api/v1/projets                 | Créer un projet              |

---

## Données initiales

| Entité             | Quantité |
|--------------------|----------|
| District           | 1        |
| Quartiers          | 6        |
| Bâtiments          | 57       |
| Capteurs IoT       | 7        |
| Relevés historiques| ~840     |
| Projets urbains    | 5        |
| Alertes            | 2        |

---

## Roadmap (phases suivantes)

- [ ] **Phase 2** : Import BIM/IFC des bâtiments publics
- [ ] **Phase 3** : Déploiement capteurs IoT physiques (JIRAMA, eau)
- [ ] **Phase 4** : Module simulation risques inondation
- [ ] **Phase 5** : Portail citoyen (signalement incidents)
- [ ] **Phase 6** : Intégration INSTAT (données census)
- [ ] **Phase 7** : Authentification & rôles (élus, techniciens, citoyens)

---

*Projet : Jumeau Numérique Ankazohabo — v1.0*
*District : Ankazohabo, Matsiatra Ambony, Madagascar*

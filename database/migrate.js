const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(path.join(dbDir, 'ankazoabo.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('🏗️  Migration de la base de données Ankazoabo...');

db.exec(`
  -- Districts et quartiers
  CREATE TABLE IF NOT EXISTS districts (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    commune TEXT NOT NULL,
    region TEXT NOT NULL,
    pays TEXT DEFAULT 'Madagascar',
    superficie_ha REAL,
    population INTEGER,
    latitude REAL,
    longitude REAL,
    altitude_m REAL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS quartiers (
    id TEXT PRIMARY KEY,
    district_id TEXT NOT NULL REFERENCES districts(id),
    nom TEXT NOT NULL,
    population INTEGER,
    superficie_ha REAL,
    geojson TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Bâtiments (entité principale de la cartographie 3D)
  CREATE TABLE IF NOT EXISTS batiments (
    id TEXT PRIMARY KEY,
    quartier_id TEXT REFERENCES quartiers(id),
    district_id TEXT NOT NULL REFERENCES districts(id),
    nom TEXT,
    type_usage TEXT NOT NULL CHECK(type_usage IN (
      'residentiel','commercial','administratif','sante',
      'education','culte','infrastructure','agricole','autre'
    )),
    statut TEXT DEFAULT 'existant' CHECK(statut IN ('existant','en_construction','demoli','projete')),
    -- Géométrie
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    altitude_base_m REAL DEFAULT 0,
    -- Attributs 3D
    nb_niveaux INTEGER DEFAULT 1,
    hauteur_m REAL,
    surface_plancher_m2 REAL,
    surface_emprise_m2 REAL,
    -- Matériaux et état
    materiau_mur TEXT,
    materiau_toit TEXT,
    etat TEXT DEFAULT 'bon' CHECK(etat IN ('tres_bon','bon','moyen','degrade','ruine')),
    -- Infra connectée
    electricite INTEGER DEFAULT 0,
    eau_courante INTEGER DEFAULT 0,
    assainissement INTEGER DEFAULT 0,
    -- Données temporelles
    annee_construction INTEGER,
    derniere_renovation INTEGER,
    -- Métadonnées
    source TEXT DEFAULT 'terrain',
    geojson_emprise TEXT,
    photo_url TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Réseaux techniques
  CREATE TABLE IF NOT EXISTS reseaux (
    id TEXT PRIMARY KEY,
    district_id TEXT NOT NULL REFERENCES districts(id),
    type TEXT NOT NULL CHECK(type IN ('eau','electricite','route','assainissement','telecom')),
    nom TEXT,
    statut TEXT DEFAULT 'actif',
    longueur_m REAL,
    capacite TEXT,
    annee_installation INTEGER,
    etat TEXT DEFAULT 'bon',
    geojson_trace TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Capteurs IoT
  CREATE TABLE IF NOT EXISTS capteurs (
    id TEXT PRIMARY KEY,
    district_id TEXT NOT NULL REFERENCES districts(id),
    batiment_id TEXT REFERENCES batiments(id),
    type TEXT NOT NULL CHECK(type IN (
      'qualite_air','temperature','humidite','pluie',
      'compteur_eau','compteur_elec','trafic','camera'
    )),
    nom TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    actif INTEGER DEFAULT 1,
    derniere_valeur REAL,
    unite TEXT,
    derniere_lecture TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Relevés capteurs (séries temporelles)
  CREATE TABLE IF NOT EXISTS releves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    capteur_id TEXT NOT NULL REFERENCES capteurs(id),
    valeur REAL NOT NULL,
    unite TEXT,
    timestamp TEXT DEFAULT (datetime('now'))
  );

  -- Population par quartier (historique)
  CREATE TABLE IF NOT EXISTS population_historique (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quartier_id TEXT REFERENCES quartiers(id),
    district_id TEXT REFERENCES districts(id),
    annee INTEGER NOT NULL,
    population INTEGER NOT NULL,
    source TEXT
  );

  -- Projets urbains
  CREATE TABLE IF NOT EXISTS projets (
    id TEXT PRIMARY KEY,
    district_id TEXT NOT NULL REFERENCES districts(id),
    titre TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK(type IN ('infrastructure','batiment','espace_vert','voirie','assainissement','autre')),
    statut TEXT DEFAULT 'planifie' CHECK(statut IN ('planifie','en_cours','termine','suspendu')),
    budget_ariary REAL,
    date_debut TEXT,
    date_fin_prevue TEXT,
    latitude REAL,
    longitude REAL,
    responsable TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Alertes et événements
  CREATE TABLE IF NOT EXISTS alertes (
    id TEXT PRIMARY KEY,
    district_id TEXT NOT NULL REFERENCES districts(id),
    type TEXT NOT NULL CHECK(type IN ('inondation','secheresse','incendie','infrastructure','sante','securite','autre')),
    niveau TEXT DEFAULT 'info' CHECK(niveau IN ('info','attention','alerte','urgence')),
    titre TEXT NOT NULL,
    description TEXT,
    latitude REAL,
    longitude REAL,
    actif INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    resolved_at TEXT
  );

  -- Index pour les performances
  CREATE INDEX IF NOT EXISTS idx_batiments_district ON batiments(district_id);
  CREATE INDEX IF NOT EXISTS idx_batiments_type ON batiments(type_usage);
  CREATE INDEX IF NOT EXISTS idx_batiments_coords ON batiments(latitude, longitude);
  CREATE INDEX IF NOT EXISTS idx_releves_capteur ON releves(capteur_id);
  CREATE INDEX IF NOT EXISTS idx_releves_timestamp ON releves(timestamp);
  CREATE INDEX IF NOT EXISTS idx_alertes_actif ON alertes(actif);
`);

console.log('✅ Migration terminée — base de données créée avec succès');
db.close();

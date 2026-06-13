const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const db = new Database(path.join(__dirname, 'ankazoabo.db'));
db.pragma('foreign_keys = ON');

console.log('🌱 Chargement des données initiales — District Ankazoabo...');

const districtId = 'dist-ankazoabo-01';
const now = new Date().toISOString();

// ─── District ────────────────────────────────────────────────────
db.prepare(`INSERT OR REPLACE INTO districts VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(
  districtId, 'Ankazoabo', 'Ankazoabo', 'Matsiatra Ambony',
  'Madagascar', 4820, 18500,
  -20.4833, 46.7167, 890,
  now, now
);

// ─── Quartiers ───────────────────────────────────────────────────
const quartiers = [
  { id: 'q-centre',    nom: 'Centre-ville',   pop: 4200, sup: 85 },
  { id: 'q-nord',      nom: 'Quartier Nord',  pop: 3800, sup: 120 },
  { id: 'q-sud',       nom: 'Quartier Sud',   pop: 3200, sup: 95 },
  { id: 'q-est',       nom: 'Quartier Est',   pop: 2900, sup: 110 },
  { id: 'q-marche',    nom: 'Zone du Marché', pop: 2600, sup: 60 },
  { id: 'q-agricole',  nom: 'Zone Agricole',  pop: 1800, sup: 350 },
];

const insQ = db.prepare(`INSERT OR REPLACE INTO quartiers VALUES (?,?,?,?,?,?,?)`);
quartiers.forEach(q => insQ.run(q.id, districtId, q.nom, q.pop, q.sup, null, now));

// ─── Bâtiments ───────────────────────────────────────────────────
const batiments = [
  // Administratifs
  { id: uuidv4(), qid:'q-centre', nom:'Mairie d\'Ankazoabo', usage:'administratif', lat:-20.4820, lon:46.7155, niv:2, haut:7.5, surf:380, mat_mur:'brique', mat_toit:'tole', etat:'bon', elec:1, eau:1, annee:1975 },
  { id: uuidv4(), qid:'q-centre', nom:'Bureau Fokontany Centre', usage:'administratif', lat:-20.4835, lon:46.7162, niv:1, haut:3.5, surf:80, mat_mur:'brique', mat_toit:'tole', etat:'moyen', elec:1, eau:0, annee:1988 },
  { id: uuidv4(), qid:'q-nord',   nom:'Bureau Fokontany Nord', usage:'administratif', lat:-20.4750, lon:46.7180, niv:1, haut:3.2, surf:65, mat_mur:'brique', mat_toit:'tole', etat:'moyen', elec:1, eau:0, annee:1992 },

  // Santé
  { id: uuidv4(), qid:'q-centre', nom:'Centre de Santé de Base II', usage:'sante', lat:-20.4828, lon:46.7170, niv:1, haut:4.0, surf:220, mat_mur:'brique', mat_toit:'tole', etat:'bon', elec:1, eau:1, annee:1985 },
  { id: uuidv4(), qid:'q-nord',   nom:'Case de Santé Quartier Nord', usage:'sante', lat:-20.4760, lon:46.7145, niv:1, haut:3.0, surf:45, mat_mur:'brique', mat_toit:'tole', etat:'degrade', elec:0, eau:0, annee:1998 },

  // Éducation
  { id: uuidv4(), qid:'q-centre', nom:'École Primaire Publique Ankazoabo I', usage:'education', lat:-20.4842, lon:46.7148, niv:1, haut:3.5, surf:480, mat_mur:'brique', mat_toit:'tole', etat:'moyen', elec:1, eau:1, annee:1966 },
  { id: uuidv4(), qid:'q-nord',   nom:'École Primaire Publique Ankazoabo II', usage:'education', lat:-20.4755, lon:46.7200, niv:1, haut:3.5, surf:360, mat_mur:'brique', mat_toit:'tole', etat:'moyen', elec:0, eau:0, annee:1978 },
  { id: uuidv4(), qid:'q-centre', nom:'Collège d\'Enseignement Général', usage:'education', lat:-20.4815, lon:46.7175, niv:1, haut:4.0, surf:620, mat_mur:'brique', mat_toit:'tole', etat:'bon', elec:1, eau:1, annee:1990 },
  { id: uuidv4(), qid:'q-est',    nom:'École Primaire Est', usage:'education', lat:-20.4840, lon:46.7220, niv:1, haut:3.2, surf:180, mat_mur:'pisé', mat_toit:'tole', etat:'degrade', elec:0, eau:0, annee:1982 },

  // Commerce / Marché
  { id: uuidv4(), qid:'q-marche', nom:'Marché Principal d\'Ankazoabo', usage:'commercial', lat:-20.4850, lon:46.7160, niv:1, haut:4.5, surf:1200, mat_mur:'brique', mat_toit:'tole', etat:'bon', elec:1, eau:1, annee:1980 },
  { id: uuidv4(), qid:'q-marche', nom:'Épicerie Centrale', usage:'commercial', lat:-20.4845, lon:46.7155, niv:1, haut:3.2, surf:35, mat_mur:'brique', mat_toit:'tole', etat:'bon', elec:1, eau:0, annee:2005 },
  { id: uuidv4(), qid:'q-marche', nom:'Quincaillerie Rasoa', usage:'commercial', lat:-20.4848, lon:46.7165, niv:1, haut:3.0, surf:28, mat_mur:'brique', mat_toit:'tole', etat:'bon', elec:1, eau:0, annee:2010 },

  // Culte
  { id: uuidv4(), qid:'q-centre', nom:'Église FJKM Ankazoabo', usage:'culte', lat:-20.4830, lon:46.7142, niv:1, haut:8.0, surf:280, mat_mur:'brique', mat_toit:'tole', etat:'bon', elec:1, eau:0, annee:1952 },
  { id: uuidv4(), qid:'q-nord',   nom:'Église Catholique Saint-Pierre', usage:'culte', lat:-20.4745, lon:46.7170, niv:1, haut:9.5, surf:220, mat_mur:'brique', mat_toit:'tole', etat:'bon', elec:1, eau:0, annee:1938 },

  // Infrastructure
  { id: uuidv4(), qid:'q-centre', nom:'Château d\'eau principal', usage:'infrastructure', lat:-20.4800, lon:46.7130, niv:1, haut:15.0, surf:40, mat_mur:'beton', mat_toit:'beton', etat:'bon', elec:1, eau:1, annee:2002 },
  { id: uuidv4(), qid:'q-centre', nom:'Poste électrique', usage:'infrastructure', lat:-20.4810, lon:46.7140, niv:1, haut:3.0, surf:25, mat_mur:'beton', mat_toit:'tole', etat:'bon', elec:1, eau:0, annee:1999 },
  { id: uuidv4(), qid:'q-centre', nom:'Bureau de Poste', usage:'administratif', lat:-20.4822, lon:46.7158, niv:1, haut:3.5, surf:55, mat_mur:'brique', mat_toit:'tole', etat:'moyen', elec:1, eau:0, annee:1970 },

  // Résidentiel (échantillon)
  ...Array.from({length: 40}, (_, i) => ({
    id: uuidv4(),
    qid: quartiers[i % quartiers.length].id,
    nom: null,
    usage: 'residentiel',
    lat: -20.4820 + (Math.sin(i*0.7)*0.015),
    lon: 46.7167 + (Math.cos(i*0.5)*0.018),
    niv: i % 5 === 0 ? 2 : 1,
    haut: i % 5 === 0 ? 6.0 : 3.2,
    surf: 40 + (i % 8)*15,
    mat_mur: i % 3 === 0 ? 'pisé' : 'brique',
    mat_toit: 'tole',
    etat: ['bon','bon','moyen','moyen','degrade'][i % 5],
    elec: i % 3 !== 0 ? 1 : 0,
    eau: i % 5 === 0 ? 1 : 0,
    annee: 1970 + (i * 1.3 | 0)
  }))
];

const insB = db.prepare(`
  INSERT OR REPLACE INTO batiments
  (id,quartier_id,district_id,nom,type_usage,latitude,longitude,altitude_base_m,
   nb_niveaux,hauteur_m,surface_emprise_m2,materiau_mur,materiau_toit,etat,
   electricite,eau_courante,annee_construction,source,created_at,updated_at)
  VALUES (?,?,?,?,?,?,?,890,?,?,?,?,?,?,?,?,?,?,?,?)
`);
batiments.forEach(b => insB.run(
  b.id, b.qid, districtId, b.nom||null, b.usage,
  b.lat, b.lon, b.niv, b.haut, b.surf,
  b.mat_mur, b.mat_toit, b.etat, b.elec, b.eau,
  b.annee, 'terrain', now, now
));

// ─── Capteurs IoT ─────────────────────────────────────────────────
const capteurs = [
  { id:'cap-01', type:'qualite_air',   nom:'Capteur air Centre-ville',  lat:-20.4825, lon:46.7155, val:42,  unite:'AQI' },
  { id:'cap-02', type:'temperature',   nom:'Station météo principale',  lat:-20.4820, lon:46.7167, val:22.5,unite:'°C' },
  { id:'cap-03', type:'pluie',         nom:'Pluviomètre district',      lat:-20.4800, lon:46.7150, val:0,   unite:'mm/h' },
  { id:'cap-04', type:'compteur_eau',  nom:'Compteur eau château',      lat:-20.4800, lon:46.7130, val:145, unite:'m³/h' },
  { id:'cap-05', type:'compteur_elec', nom:'Compteur électrique poste', lat:-20.4810, lon:46.7140, val:380, unite:'kWh' },
  { id:'cap-06', type:'humidite',      nom:'Humidité zone agricole',    lat:-20.4950, lon:46.7200, val:68,  unite:'%' },
  { id:'cap-07', type:'trafic',        nom:'Trafic route nationale',    lat:-20.4855, lon:46.7100, val:24,  unite:'véh/h' },
];

const insC = db.prepare(`
  INSERT OR REPLACE INTO capteurs
  (id,district_id,type,nom,latitude,longitude,actif,derniere_valeur,unite,derniere_lecture,created_at)
  VALUES (?,?,?,?,?,?,1,?,?,?,?)
`);
capteurs.forEach(c => insC.run(c.id, districtId, c.type, c.nom, c.lat, c.lon, c.val, c.unite, now, now));

// Relevés historiques (30 jours)
const insR = db.prepare(`INSERT INTO releves (capteur_id, valeur, unite, timestamp) VALUES (?,?,?,?)`);
capteurs.forEach(c => {
  for (let d = 29; d >= 0; d--) {
    for (let h = 0; h < 24; h += 6) {
      const ts = new Date(Date.now() - d*86400000 - h*3600000).toISOString();
      const noise = (Math.random() - 0.5) * c.val * 0.2;
      insR.run(c.id, Math.max(0, c.val + noise).toFixed(2), c.unite, ts);
    }
  }
});

// ─── Projets urbains ──────────────────────────────────────────────
const projets = [
  { id:uuidv4(), titre:'Réhabilitation route principale', type:'voirie', statut:'en_cours', budget:45000000, lat:-20.4855, lon:46.7100, resp:'Mairie Ankazohabo' },
  { id:uuidv4(), titre:'Extension réseau eau potable Q. Nord', type:'infrastructure', statut:'planifie', budget:32000000, lat:-20.4760, lon:46.7180, resp:'JIRAMA' },
  { id:uuidv4(), titre:'Construction marché couvert secondaire', type:'batiment', statut:'planifie', budget:28000000, lat:-20.4840, lon:46.7200, resp:'Mairie Ankazohabo' },
  { id:uuidv4(), titre:'Aménagement espace vert central', type:'espace_vert', statut:'termine', budget:8000000, lat:-20.4830, lon:46.7160, resp:'Mairie Ankazohabo' },
  { id:uuidv4(), titre:'Électrification Zone Agricole', type:'infrastructure', statut:'planifie', budget:55000000, lat:-20.4950, lon:46.7200, resp:'JIRAMA' },
];
const insP = db.prepare(`INSERT OR REPLACE INTO projets (id,district_id,titre,type,statut,budget_ariary,date_debut,date_fin_prevue,latitude,longitude,responsable,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
projets.forEach(p => insP.run(p.id, districtId, p.titre, p.type, p.statut, p.budget, '2024-01-01', '2025-12-31', p.lat, p.lon, p.resp, now));

// ─── Alertes ──────────────────────────────────────────────────────
const insA = db.prepare(`INSERT OR REPLACE INTO alertes (id,district_id,type,niveau,titre,description,latitude,longitude,actif,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)`);
insA.run(uuidv4(), districtId, 'infrastructure', 'attention', 'Fuite réseau eau — Rue Principale', 'Perte estimée à 12 m³/h détectée par capteur cap-04', -20.4825, 46.7148, 1, now);
insA.run(uuidv4(), districtId, 'inondation', 'info', 'Surveillance renforcée zone basse', 'Fortes pluies annoncées, zone Q. Sud à surveiller', -20.4870, 46.7150, 1, now);

// ─── Historique population ────────────────────────────────────────
const insH = db.prepare(`INSERT INTO population_historique (quartier_id,district_id,annee,population,source) VALUES (?,?,?,?,?)`);
[2015,2018,2020,2022,2024].forEach((yr,i) => {
  quartiers.forEach(q => insH.run(q.id, districtId, yr, Math.round(q.pop * (0.85 + i*0.04)), 'Recensement INSTAT'));
});

console.log(`✅ Données initiales chargées :`);
console.log(`   • 1 district (Ankazoabo)`);
console.log(`   • ${quartiers.length} quartiers`);
console.log(`   • ${batiments.length} bâtiments`);
console.log(`   • ${capteurs.length} capteurs IoT`);
console.log(`   • ${capteurs.length * 4 * 30} relevés historiques`);
console.log(`   • ${projets.length} projets urbains`);
db.close();

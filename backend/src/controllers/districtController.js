const { getDb } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const DISTRICT_ID = 'dist-ankazoabo-01';

// ── District ──────────────────────────────────────────────────────
exports.getDistrict = (req, res) => {
  const db = getDb();
  const district = db.prepare('SELECT * FROM districts WHERE id=?').get(DISTRICT_ID);
  const quartiers = db.prepare('SELECT * FROM quartiers WHERE district_id=?').all(DISTRICT_ID);
  res.json({ success: true, data: { ...district, quartiers } });
};

// ── Capteurs & relevés ────────────────────────────────────────────
exports.getCapteurs = (req, res) => {
  const db = getDb();
  const capteurs = db.prepare('SELECT * FROM capteurs WHERE district_id=?').all(DISTRICT_ID);
  res.json({ success: true, data: capteurs });
};

exports.getReleves = (req, res) => {
  const db = getDb();
  const { capteur_id, days = 7 } = req.query;
  const since = new Date(Date.now() - days * 86400000).toISOString();
  let sql = `SELECT r.*, c.nom as capteur_nom, c.type as capteur_type
    FROM releves r JOIN capteurs c ON r.capteur_id = c.id
    WHERE c.district_id = ? AND r.timestamp >= ? `;
  const params = [DISTRICT_ID, since];
  if (capteur_id) { sql += 'AND r.capteur_id = ? '; params.push(capteur_id); }
  sql += 'ORDER BY r.timestamp DESC LIMIT 2000';
  res.json({ success: true, data: db.prepare(sql).all(...params) });
};

exports.addReleve = (req, res) => {
  const db = getDb();
  const { capteur_id, valeur, unite } = req.body;
  const ts = new Date().toISOString();
  db.prepare('INSERT INTO releves (capteur_id,valeur,unite,timestamp) VALUES (?,?,?,?)').run(capteur_id, valeur, unite, ts);
  db.prepare('UPDATE capteurs SET derniere_valeur=?, derniere_lecture=? WHERE id=?').run(valeur, ts, capteur_id);
  res.status(201).json({ success: true, message: 'Relevé enregistré' });
};

// ── Alertes ───────────────────────────────────────────────────────
exports.getAlertes = (req, res) => {
  const db = getDb();
  const { actif } = req.query;
  let sql = 'SELECT * FROM alertes WHERE district_id=?';
  const params = [DISTRICT_ID];
  if (actif !== undefined) { sql += ' AND actif=?'; params.push(parseInt(actif)); }
  sql += ' ORDER BY created_at DESC';
  res.json({ success: true, data: db.prepare(sql).all(...params) });
};

exports.createAlerte = (req, res) => {
  const db = getDb();
  const id = uuidv4();
  const { type, niveau, titre, description, latitude, longitude } = req.body;
  db.prepare(`INSERT INTO alertes (id,district_id,type,niveau,titre,description,latitude,longitude,actif,created_at)
    VALUES (?,?,?,?,?,?,?,?,1,?)`).run(id, DISTRICT_ID, type, niveau, titre, description, latitude, longitude, new Date().toISOString());
  res.status(201).json({ success: true, data: { id } });
};

exports.resolveAlerte = (req, res) => {
  const db = getDb();
  db.prepare('UPDATE alertes SET actif=0, resolved_at=? WHERE id=? AND district_id=?')
    .run(new Date().toISOString(), req.params.id, DISTRICT_ID);
  res.json({ success: true, message: 'Alerte résolue' });
};

// ── Projets ───────────────────────────────────────────────────────
exports.getProjets = (req, res) => {
  const db = getDb();
  const projets = db.prepare('SELECT * FROM projets WHERE district_id=? ORDER BY created_at DESC').all(DISTRICT_ID);
  res.json({ success: true, data: projets });
};

exports.createProjet = (req, res) => {
  const db = getDb();
  const id = uuidv4();
  const { titre, description, type, statut, budget_ariary, date_debut, date_fin_prevue, latitude, longitude, responsable } = req.body;
  db.prepare(`INSERT INTO projets (id,district_id,titre,description,type,statut,budget_ariary,date_debut,date_fin_prevue,latitude,longitude,responsable,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(id, DISTRICT_ID, titre, description, type, statut||'planifie', budget_ariary, date_debut, date_fin_prevue, latitude, longitude, responsable, new Date().toISOString());
  res.status(201).json({ success: true, data: { id } });
};

// ── Dashboard KPI ─────────────────────────────────────────────────
exports.getDashboard = (req, res) => {
  const db = getDb();
  const district = db.prepare('SELECT * FROM districts WHERE id=?').get(DISTRICT_ID);
  const batStats = db.prepare(`SELECT COUNT(*) as total, SUM(electricite) as elec, SUM(eau_courante) as eau FROM batiments WHERE district_id=?`).get(DISTRICT_ID);
  const alertesActives = db.prepare(`SELECT COUNT(*) as count, niveau FROM alertes WHERE district_id=? AND actif=1 GROUP BY niveau`).all(DISTRICT_ID);
  const projetsEnCours = db.prepare(`SELECT COUNT(*) as count FROM projets WHERE district_id=? AND statut='en_cours'`).get(DISTRICT_ID);
  const derniersCapteurs = db.prepare(`SELECT * FROM capteurs WHERE district_id=? AND actif=1`).all(DISTRICT_ID);

  res.json({
    success: true,
    data: {
      district,
      batiments: batStats,
      alertes: alertesActives,
      projets_en_cours: projetsEnCours.count,
      capteurs: derniersCapteurs,
      timestamp: new Date().toISOString()
    }
  });
};

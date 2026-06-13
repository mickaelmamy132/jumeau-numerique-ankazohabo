const { getDb } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const DISTRICT_ID = 'dist-ankazoabo-01';

exports.getAll = (req, res) => {
  const db = getDb();
  const { type_usage, etat, quartier_id, limit = 500 } = req.query;
  let sql = `
    SELECT b.*, q.nom as quartier_nom
    FROM batiments b
    LEFT JOIN quartiers q ON b.quartier_id = q.id
    WHERE b.district_id = ?
  `;
  const params = [DISTRICT_ID];
  if (type_usage) { sql += ' AND b.type_usage = ?'; params.push(type_usage); }
  if (etat)       { sql += ' AND b.etat = ?';       params.push(etat); }
  if (quartier_id){ sql += ' AND b.quartier_id = ?'; params.push(quartier_id); }
  sql += ' LIMIT ?'; params.push(parseInt(limit));

  const batiments = db.prepare(sql).all(...params);
  res.json({ success: true, count: batiments.length, data: batiments });
};

exports.getById = (req, res) => {
  const db = getDb();
  const row = db.prepare(`
    SELECT b.*, q.nom as quartier_nom
    FROM batiments b LEFT JOIN quartiers q ON b.quartier_id = q.id
    WHERE b.id = ? AND b.district_id = ?
  `).get(req.params.id, DISTRICT_ID);
  if (!row) return res.status(404).json({ success: false, message: 'Bâtiment introuvable' });
  res.json({ success: true, data: row });
};

exports.create = (req, res) => {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();
  const {
    quartier_id, nom, type_usage, latitude, longitude, altitude_base_m = 890,
    nb_niveaux = 1, hauteur_m, surface_emprise_m2, materiau_mur, materiau_toit,
    etat = 'bon', electricite = 0, eau_courante = 0, assainissement = 0,
    annee_construction, notes, statut = 'existant'
  } = req.body;

  try {
    db.prepare(`
      INSERT INTO batiments (id,district_id,quartier_id,nom,type_usage,statut,
        latitude,longitude,altitude_base_m,nb_niveaux,hauteur_m,surface_emprise_m2,
        materiau_mur,materiau_toit,etat,electricite,eau_courante,assainissement,
        annee_construction,notes,source,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'terrain',?,?)
    `).run(id, DISTRICT_ID, quartier_id, nom, type_usage, statut,
        latitude, longitude, altitude_base_m, nb_niveaux, hauteur_m,
        surface_emprise_m2, materiau_mur, materiau_toit, etat,
        electricite, eau_courante, assainissement, annee_construction, notes, now, now);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.update = (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM batiments WHERE id=? AND district_id=?')
    .get(req.params.id, DISTRICT_ID);
  if (!existing) return res.status(404).json({ success: false, message: 'Bâtiment introuvable' });

  const allowed = ['nom','type_usage','statut','nb_niveaux','hauteur_m','surface_emprise_m2',
    'materiau_mur','materiau_toit','etat','electricite','eau_courante','assainissement',
    'annee_construction','notes','quartier_id'];
  const fields = Object.keys(req.body).filter(k => allowed.includes(k));
  if (!fields.length) return res.status(400).json({ success: false, message: 'Aucun champ valide' });

  const set = fields.map(f => `${f}=?`).join(',');
  const vals = fields.map(f => req.body[f]);
  db.prepare(`UPDATE batiments SET ${set}, updated_at=? WHERE id=?`)
    .run(...vals, new Date().toISOString(), req.params.id);
  res.json({ success: true, message: 'Bâtiment mis à jour' });
};

exports.delete = (req, res) => {
  const db = getDb();
  const info = db.prepare('DELETE FROM batiments WHERE id=? AND district_id=?')
    .run(req.params.id, DISTRICT_ID);
  if (!info.changes) return res.status(404).json({ success: false, message: 'Bâtiment introuvable' });
  res.json({ success: true, message: 'Bâtiment supprimé' });
};

exports.getStats = (req, res) => {
  const db = getDb();
  const byType  = db.prepare(`SELECT type_usage, COUNT(*) as count FROM batiments WHERE district_id=? GROUP BY type_usage`).all(DISTRICT_ID);
  const byEtat  = db.prepare(`SELECT etat, COUNT(*) as count FROM batiments WHERE district_id=? GROUP BY etat`).all(DISTRICT_ID);
  const byQuart = db.prepare(`SELECT q.nom, COUNT(b.id) as count FROM batiments b LEFT JOIN quartiers q ON b.quartier_id=q.id WHERE b.district_id=? GROUP BY b.quartier_id`).all(DISTRICT_ID);
  const totaux  = db.prepare(`SELECT COUNT(*) as total, SUM(electricite) as avec_elec, SUM(eau_courante) as avec_eau, AVG(nb_niveaux) as moy_niveaux FROM batiments WHERE district_id=?`).get(DISTRICT_ID);
  res.json({ success: true, data: { totaux, par_type: byType, par_etat: byEtat, par_quartier: byQuart } });
};

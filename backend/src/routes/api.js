const router = require('express').Router();
const bat = require('../controllers/batimentsController');
const dist = require('../controllers/districtController');

// ── District & dashboard ──────────────────────────────────────────
router.get('/district',   dist.getDistrict);
router.get('/dashboard',  dist.getDashboard);

// ── Bâtiments ─────────────────────────────────────────────────────
router.get('/batiments',          bat.getAll);
router.get('/batiments/stats',    bat.getStats);
router.get('/batiments/:id',      bat.getById);
router.post('/batiments',         bat.create);
router.put('/batiments/:id',      bat.update);
router.delete('/batiments/:id',   bat.delete);

// ── Capteurs & relevés ────────────────────────────────────────────
router.get('/capteurs',           dist.getCapteurs);
router.get('/releves',            dist.getReleves);
router.post('/releves',           dist.addReleve);

// ── Alertes ───────────────────────────────────────────────────────
router.get('/alertes',            dist.getAlertes);
router.post('/alertes',           dist.createAlerte);
router.patch('/alertes/:id/resolve', dist.resolveAlerte);

// ── Projets ───────────────────────────────────────────────────────
router.get('/projets',            dist.getProjets);
router.post('/projets',           dist.createProjet);

module.exports = router;

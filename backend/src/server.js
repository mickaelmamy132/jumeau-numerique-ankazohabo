require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1', require('./routes/api'));

// Health check
app.get('/health', (_, res) => res.json({
  status: 'ok',
  project: 'Jumeau Numérique Ankazoabo',
  version: '1.0.0',
  timestamp: new Date().toISOString()
}));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route introuvable' }));

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur serveur interne' });
});

app.listen(PORT, () => {
  console.log(`🌍 Jumeau Numérique Ankazoabo — API démarrée sur http://localhost:${PORT}`);
  console.log(`📍 District : Ankazoabo, Matsiatra Ambony, Madagascar`);
  console.log(`📡 Endpoints : http://localhost:${PORT}/api/v1/`);
});

module.exports = app;

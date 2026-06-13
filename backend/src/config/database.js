const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

let _db = null;
const dbDir = path.resolve(__dirname, '../../database');
const dbPath = path.join(dbDir, 'ankazoabo.db');

async function getDb() {
  if (_db) return _db;
  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    _db = new SQL.Database(fs.readFileSync(dbPath));
  } else {
    _db = new SQL.Database();
  }
  _db.run = _db.run.bind(_db);

  // Wrap exec to look like better-sqlite3 prepare API
  _db.prepare = (sql) => ({
    all: (...params) => {
      const results = [];
      _db.each(sql, params, row => results.push(row));
      return results;
    },
    get: (...params) => {
      const rows = _db.exec(sql, params);
      if (!rows.length || !rows[0].values.length) return undefined;
      const cols = rows[0].columns;
      const vals = rows[0].values[0];
      return Object.fromEntries(cols.map((c,i) => [c, vals[i]]));
    },
    run: (...params) => { _db.run(sql, params); _save(); return { changes: _db.getRowsModified() }; }
  });
  _db.pragma = () => {};

  function _save() {
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    fs.writeFileSync(dbPath, Buffer.from(_db.export()));
  }

  return _db;
}

module.exports = { getDb };

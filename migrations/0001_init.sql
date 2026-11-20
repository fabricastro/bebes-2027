-- Wish entries. birth_date is an ISO 'YYYY-MM-DD' string; never parsed as a Date.
CREATE TABLE entries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  name_key   TEXT    NOT NULL,
  birth_date TEXT    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE UNIQUE INDEX entries_unique_person ON entries (name_key, birth_date);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO settings (key, value) VALUES ('open', '1');

-- Per-IP submission throttle. ip_hash is a salted SHA-256, never the raw IP.
CREATE TABLE rate_limits (
  ip_hash      TEXT    NOT NULL,
  window_start INTEGER NOT NULL,
  count        INTEGER NOT NULL,
  PRIMARY KEY (ip_hash, window_start)
);

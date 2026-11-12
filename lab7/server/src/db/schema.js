export function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS titles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      title_uk TEXT NOT NULL,
      type TEXT NOT NULL,
      creator TEXT NOT NULL,
      year INTEGER NOT NULL,
      genre TEXT NOT NULL,
      quality TEXT NOT NULL,
      rating REAL NOT NULL,
      duration TEXT NOT NULL,
      duration_sec INTEGER NOT NULL DEFAULT 0,
      bitrate TEXT NOT NULL,
      badge_text TEXT,
      studio TEXT NOT NULL,
      episodes_count TEXT,
      synopsis TEXT NOT NULL,
      poster TEXT,
      backdrop TEXT,
      tags TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS episodes (
      id TEXT PRIMARY KEY,
      title_id TEXT NOT NULL,
      num TEXT NOT NULL,
      title TEXT NOT NULL,
      duration TEXT NOT NULL,
      duration_sec INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mirrors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      ping TEXT NOT NULL,
      load TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      user_id TEXT NOT NULL,
      title_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, title_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS watch_progress (
      user_id TEXT NOT NULL,
      title_id TEXT NOT NULL,
      episode_id TEXT NOT NULL DEFAULT '',
      position_sec REAL NOT NULL DEFAULT 0,
      duration_sec REAL NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, title_id, episode_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mirror_selections (
      user_id TEXT NOT NULL,
      title_id TEXT NOT NULL,
      mirror_id TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, title_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (title_id) REFERENCES titles(id) ON DELETE CASCADE,
      FOREIGN KEY (mirror_id) REFERENCES mirrors(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_episodes_title ON episodes(title_id, sort_order);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_progress_user ON watch_progress(user_id, updated_at);
    CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets(user_id);
  `);
}

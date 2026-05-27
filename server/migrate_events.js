const pool = require('./db')

async function migrateEvents() {
  try {
    console.log('Starting events table migration...')

    // Rename old events table (if it exists and hasn't been renamed yet)
    await pool.query(`ALTER TABLE IF EXISTS events RENAME TO events_old`)
    console.log('  ✓ Renamed old events table to events_old')

    // Create new events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title       TEXT NOT NULL,
        slug        TEXT NOT NULL UNIQUE,
        description TEXT,
        location    TEXT,
        map_url     TEXT,
        event_type  TEXT NOT NULL DEFAULT 'general',
        status      TEXT NOT NULL DEFAULT 'upcoming'
                      CHECK (status IN ('upcoming','ongoing','past','cancelled')),
        starts_at   TIMESTAMPTZ NOT NULL,
        ends_at     TIMESTAMPTZ,
        cover_image TEXT,
        reg_url     TEXT,
        is_featured BOOLEAN NOT NULL DEFAULT false,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)
    console.log('  ✓ Created new events table')

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_events_status ON events (status)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_events_starts_at ON events (starts_at DESC)`)
    console.log('  ✓ Created indexes')

    // Create updated_at trigger
    await pool.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN NEW.updated_at = now(); RETURN NEW; END;
      $$ LANGUAGE plpgsql
    `)
    await pool.query(`
      DROP TRIGGER IF EXISTS events_updated_at ON events
    `)
    await pool.query(`
      CREATE TRIGGER events_updated_at
        BEFORE UPDATE ON events
        FOR EACH ROW EXECUTE FUNCTION set_updated_at()
    `)
    console.log('  ✓ Created updated_at trigger')

    console.log('\n✅ Events migration completed successfully!')
  } catch (err) {
    console.error('Migration failed:', err.message)
  } finally {
    await pool.end()
  }
}

migrateEvents()

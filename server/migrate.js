const fs = require('fs')
const path = require('path')
const pool = require('./db')

async function migrate() {
  const migrationPath = path.join(__dirname, '../migration.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  try {
    console.log('Starting migration...')
    await pool.query(sql)
    console.log('Migration completed successfully.')
  } catch (err) {
    console.error('Migration failed:', err)
  } finally {
    await pool.end()
  }
}

migrate()
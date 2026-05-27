const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  host:     'localhost',
  port:     5432,
  database: 'ECAN',
  user:     'postgres',
  password: 'sahid123',
})

async function migrateSubmissions() {
  const migrationPath = path.join(__dirname, '../submissions.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  try {
    console.log('Starting submissions migration with hardcoded credentials...')
    await pool.query(sql)
    console.log('Submissions migration completed successfully.')
  } catch (err) {
    console.error('Submissions migration failed:', err)
  } finally {
    await pool.end()
  }
}

migrateSubmissions()
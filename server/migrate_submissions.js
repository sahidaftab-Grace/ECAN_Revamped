const fs = require('fs')
const path = require('path')
const pool = require('./db')

async function migrateSubmissions() {
  const migrationPath = path.join(__dirname, '../submissions.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  try {
    console.log('Starting submissions migration...')
    await pool.query(sql)
    console.log('Submissions migration completed successfully.')
  } catch (err) {
    console.error('Submissions migration failed:', err)
  } finally {
    await pool.end()
  }
}

migrateSubmissions()
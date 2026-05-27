const fs = require('fs')
const path = require('path')
const pool = require('./db')

async function migrate() {
  const migrationPath = path.join(__dirname, 'upgrade_board.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  try {
    console.log('Starting board upgrade...')
    await pool.query(sql)
    console.log('Upgrade completed successfully.')
  } catch (err) {
    console.error('Upgrade failed:', err)
  } finally {
    await pool.end()
  }
}

migrate()
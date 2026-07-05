const pool = require('./db')

async function migrateBoardContentFields() {
  try {
    console.log('Adding board member content fields...')

    await pool.query(`
      ALTER TABLE board_members
        ADD COLUMN IF NOT EXISTS category text DEFAULT 'officer',
        ADD COLUMN IF NOT EXISTS email text DEFAULT '',
        ADD COLUMN IF NOT EXISTS phone text DEFAULT '',
        ADD COLUMN IF NOT EXISTS bio text DEFAULT '',
        ADD COLUMN IF NOT EXISTS quote text DEFAULT ''
    `)

    await pool.query(`
      UPDATE board_members
      SET category = COALESCE(NULLIF(category, ''), 'officer'),
          email = COALESCE(email, ''),
          phone = COALESCE(phone, ''),
          bio = COALESCE(bio, ''),
          quote = COALESCE(quote, '')
    `)

    console.log('Board member content fields are ready.')
  } catch (err) {
    console.error('Board member content migration failed:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

migrateBoardContentFields()

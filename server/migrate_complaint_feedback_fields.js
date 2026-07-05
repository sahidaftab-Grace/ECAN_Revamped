const pool = require('./db')

async function migrateComplaintFeedbackFields() {
  try {
    console.log('Adding complaint and feedback fields...')

    await pool.query(`
      ALTER TABLE complaint_submissions
        ADD COLUMN IF NOT EXISTS reference_number text,
        ADD COLUMN IF NOT EXISTS relationship text DEFAULT '',
        ADD COLUMN IF NOT EXISTS communication_method text DEFAULT '',
        ADD COLUMN IF NOT EXISTS consultancy_name text DEFAULT '',
        ADD COLUMN IF NOT EXISTS branch_location text DEFAULT '',
        ADD COLUMN IF NOT EXISTS counselor_name text DEFAULT '',
        ADD COLUMN IF NOT EXISTS submission_type text DEFAULT '',
        ADD COLUMN IF NOT EXISTS issue_area text DEFAULT '',
        ADD COLUMN IF NOT EXISTS incident_date date,
        ADD COLUMN IF NOT EXISTS study_country text DEFAULT '',
        ADD COLUMN IF NOT EXISTS expected_resolution text DEFAULT '',
        ADD COLUMN IF NOT EXISTS truth_declaration boolean DEFAULT false,
        ADD COLUMN IF NOT EXISTS process_declaration boolean DEFAULT false,
        ADD COLUMN IF NOT EXISTS privacy_declaration boolean DEFAULT false,
        ADD COLUMN IF NOT EXISTS documents jsonb DEFAULT '[]'::jsonb
    `)

    await pool.query(`
      UPDATE complaint_submissions
      SET reference_number = COALESCE(reference_number, 'ECAN-CF-' || EXTRACT(YEAR FROM created_at)::int || '-' || substring(id::text, 1, 6)),
          documents = COALESCE(documents, '[]'::jsonb)
    `)

    console.log('Complaint and feedback fields are ready.')
  } catch (err) {
    console.error('Complaint feedback migration failed:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

migrateComplaintFeedbackFields()

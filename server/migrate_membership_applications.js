const pool = require('./db')

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS membership_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ DEFAULT now(),
        status TEXT NOT NULL DEFAULT 'new',
        membership_type TEXT NOT NULL DEFAULT 'General Member',
        company_name TEXT NOT NULL,
        registration_number TEXT NOT NULL,
        pan_vat_number TEXT NOT NULL,
        established_year INT,
        company_address TEXT NOT NULL DEFAULT '',
        province TEXT NOT NULL DEFAULT '',
        district TEXT NOT NULL DEFAULT '',
        city TEXT NOT NULL DEFAULT '',
        website_url TEXT NOT NULL DEFAULT '',
        office_phone TEXT NOT NULL DEFAULT '',
        company_email TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        owner_phone TEXT NOT NULL DEFAULT '',
        owner_email TEXT NOT NULL,
        contact_person_name TEXT NOT NULL DEFAULT '',
        contact_person_role TEXT NOT NULL DEFAULT '',
        main_focus_countries TEXT NOT NULL,
        services_offered TEXT NOT NULL,
        destination_partners TEXT NOT NULL DEFAULT '',
        counselor_count INT,
        annual_student_count INT,
        ministry_approval_status TEXT NOT NULL DEFAULT '',
        message TEXT NOT NULL DEFAULT '',
        agree_code_of_conduct BOOLEAN NOT NULL DEFAULT false,
        documents JSONB NOT NULL DEFAULT '{}'::jsonb,
        internal_notes TEXT NOT NULL DEFAULT ''
      );

      CREATE INDEX IF NOT EXISTS idx_membership_applications_status
        ON membership_applications (status);
      CREATE INDEX IF NOT EXISTS idx_membership_applications_company
        ON membership_applications (company_name);
    `)
    console.log('Membership applications migration completed successfully.')
  } finally {
    await pool.end()
  }
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})

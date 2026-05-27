const router = require('express').Router()
const pool = require('../db')
const { authenticate } = require('../middleware/auth')
const multer = require('multer')
const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')

const upload = multer({ dest: 'uploads/' })

// GET all members
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members ORDER BY name ASC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create member
router.post('/', authenticate, async (req, res) => {
  const { name, city, focus, est, email, phone, website, address, membership_type, logo_url, published } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO members (name, city, focus, est, email, phone, website, address, membership_type, logo_url, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [name, city, focus, est, email, phone, website, address, membership_type, logo_url, published]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update member
router.put('/:id', authenticate, async (req, res) => {
  const { name, city, focus, est, email, phone, website, address, membership_type, logo_url, published } = req.body
  try {
    const result = await pool.query(
      `UPDATE members SET name=$1, city=$2, focus=$3, est=$4, email=$5, phone=$6, website=$7, address=$8, membership_type=$9, logo_url=$10, published=$11
       WHERE id=$12 RETURNING *`,
      [name, city, focus, est, email, phone, website, address, membership_type, logo_url, published, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE member
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM members WHERE id = $1', [req.params.id])
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET sample CSV template
router.get('/sample-csv', (req, res) => {
  const filePath = path.join(__dirname, '../../member_upload_sample.csv')
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'member_upload_sample.csv')
  } else {
    res.status(404).json({ error: 'Sample file not found' })
  }
})

// POST bulk upload members from CSV
router.post('/bulk-upload', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const results = []
  const filePath = req.file.path

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        console.log(`Processing CSV with ${results.length} rows`)
        
        // Start a transaction for bulk insert
        const client = await pool.connect()
        try {
          await client.query('BEGIN')
          for (const row of results) {
            // Map CSV headers to database columns
            const name = row.name || row.Name
            const city = row.city || row.City || 'Unknown'
            const focus = row.focus || row.Focus || ''
            const est = row.est || row.Est || row.established || null
            const email = row.email || row.Email || ''
            const phone = row.phone || row.Phone || ''
            const website = row.website || row.Website || ''
            const address = row.address || row.Address || ''
            const membership_type = row.membership_type || row.MembershipType || 'Full Member'
            const logo_url = row.logo_url || row.Logo || ''
            const published = row.published === 'false' || row.published === '0' ? false : true

            if (!name) continue // Skip rows without a name

            await client.query(
              `INSERT INTO members (name, city, focus, est, email, phone, website, address, membership_type, logo_url, published)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
              [name, city, focus, est ? parseInt(est) : null, email, phone, website, address, membership_type, logo_url, published]
            )
          }
          await client.query('COMMIT')
          res.json({ success: true, count: results.length })
        } catch (err) {
          await client.query('ROLLBACK')
          throw err
        } finally {
          client.release()
        }
      } catch (err) {
        console.error('Bulk upload error:', err)
        res.status(500).json({ error: err.message })
      } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      }
    })
    .on('error', (err) => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      res.status(500).json({ error: err.message })
    })
})

module.exports = router

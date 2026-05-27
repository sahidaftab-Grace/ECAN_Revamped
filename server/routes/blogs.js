const router = require('express').Router()
const pool = require('../db')
const { authenticate } = require('../middleware/auth')

// GET all blog posts (published or not for admin)
router.get('/all', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blog_posts ORDER BY date DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET published blog posts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM blog_posts WHERE published = true ORDER BY date DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single blog post by slug or id
router.get('/:idOrSlug', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM blog_posts WHERE slug = $1 OR id::text = $1',
      [req.params.idOrSlug]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create blog
router.post('/', authenticate, async (req, res) => {
  const { slug, title, excerpt, content, author, category, date, published, read_time, layout, cover_image, images } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO blog_posts (slug, title, excerpt, content, author, category, date, published, read_time, layout, cover_image, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [slug, title, excerpt, content, author, category, date, published, read_time || 5, layout, cover_image, images || []]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update blog
router.put('/:id', authenticate, async (req, res) => {
  const { slug, title, excerpt, content, author, category, date, published, read_time, layout, cover_image, images } = req.body
  try {
    const result = await pool.query(
      `UPDATE blog_posts SET slug=$1, title=$2, excerpt=$3, content=$4, author=$5, category=$6, date=$7, published=$8, read_time=$9, layout=$10, cover_image=$11, images=$12
       WHERE id=$13 RETURNING *`,
      [slug, title, excerpt, content, author, category, date, published, read_time || 5, layout, cover_image, images || [], req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE blog
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM blog_posts WHERE id = $1', [req.params.id])
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
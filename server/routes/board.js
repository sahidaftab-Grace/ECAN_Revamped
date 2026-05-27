const router = require('express').Router()
const pool = require('../db')
const { authenticate } = require('../middleware/auth')

// GET all board members
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM board_members ORDER BY sort_order ASC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET board members by term
router.get('/:term', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM board_members WHERE term = $1 ORDER BY sort_order ASC',
      [req.params.term]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create board member
router.post('/', authenticate, async (req, res) => {
  const { name, role, term, image_url, sort_order } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO board_members (name, role, term, image_url, sort_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, role, term || 'current', image_url, sort_order || 0]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update board member
router.put('/:id', authenticate, async (req, res) => {
  const { name, role, term, image_url, sort_order } = req.body
  try {
    const result = await pool.query(
      `UPDATE board_members SET name=$1, role=$2, term=$3, image_url=$4, sort_order=$5
       WHERE id=$6 RETURNING *`,
      [name, role, term || 'current', image_url, sort_order || 0, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE board member
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM board_members WHERE id = $1', [req.params.id])
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
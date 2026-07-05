const router = require('express').Router()
const pool = require('../db')
const { authenticate } = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM past_board_members
      ORDER BY term_sort_order ASC, sort_order ASC, name ASC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', authenticate, async (req, res) => {
  const { term, name, role, image_url, sort_order, term_sort_order } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO past_board_members
       (term, name, role, image_url, sort_order, term_sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [term, name, role, image_url || '', sort_order || 0, term_sort_order || 0]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', authenticate, async (req, res) => {
  const { term, name, role, image_url, sort_order, term_sort_order } = req.body
  try {
    const result = await pool.query(
      `UPDATE past_board_members
       SET term=$1,
           name=$2,
           role=$3,
           image_url=$4,
           sort_order=$5,
           term_sort_order=$6
       WHERE id=$7
       RETURNING *`,
      [term, name, role, image_url || '', sort_order || 0, term_sort_order || 0, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/term/:term', authenticate, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM past_board_members WHERE term = $1 RETURNING id', [req.params.term])
    res.json({ deleted: result.rowCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM past_board_members WHERE id = $1', [req.params.id])
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

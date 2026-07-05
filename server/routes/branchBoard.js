const router = require('express').Router()
const pool = require('../db')
const { authenticate } = require('../middleware/auth')

function mapRow(row) {
  return {
    id: row.id,
    branch_slug: row.branch_slug,
    branch_name: row.branch_name,
    province: row.province,
    color: row.color,
    accent: row.accent,
    contact: row.contact,
    name: row.member_name,
    role: row.role || 'Executive Member',
    image_url: row.image_url,
    sort_order: row.sort_order,
    branch_sort_order: row.branch_sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function normalizeRole(role) {
  return typeof role === 'string' && role.trim() ? role.trim() : 'Executive Member'
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM branch_board_members
      ORDER BY branch_sort_order ASC, sort_order ASC, member_name ASC
    `)
    res.json(result.rows.map(mapRow))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', authenticate, async (req, res) => {
  const {
    branch_slug,
    branch_name,
    province,
    color,
    accent,
    contact,
    name,
    role,
    image_url,
    sort_order,
    branch_sort_order,
  } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO branch_board_members
       (branch_slug, branch_name, province, color, accent, contact, member_name, role, image_url, sort_order, branch_sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        branch_slug,
        branch_name,
        province || '',
        color || 'from-slate-700 to-slate-900',
        accent || 'bg-slate-500',
        contact || '',
        name,
        normalizeRole(role),
        image_url || '',
        sort_order || 0,
        branch_sort_order || 0,
      ]
    )
    res.status(201).json(mapRow(result.rows[0]))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', authenticate, async (req, res) => {
  const {
    branch_slug,
    branch_name,
    province,
    color,
    accent,
    contact,
    name,
    role,
    image_url,
    sort_order,
    branch_sort_order,
  } = req.body

  try {
    const result = await pool.query(
      `UPDATE branch_board_members
       SET branch_slug=$1,
           branch_name=$2,
           province=$3,
           color=$4,
           accent=$5,
           contact=$6,
           member_name=$7,
           role=$8,
           image_url=$9,
           sort_order=$10,
           branch_sort_order=$11,
           updated_at=now()
       WHERE id=$12
       RETURNING *`,
      [
        branch_slug,
        branch_name,
        province || '',
        color || 'from-slate-700 to-slate-900',
        accent || 'bg-slate-500',
        contact || '',
        name,
        normalizeRole(role),
        image_url || '',
        sort_order || 0,
        branch_sort_order || 0,
        req.params.id,
      ]
    )
    res.json(mapRow(result.rows[0]))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM branch_board_members WHERE id = $1', [req.params.id])
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

const router = require('express').Router();
const pool = require('../db');
const { authenticate } = require('../middleware/auth');

// ── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// POST /api/submissions/contact - Public contact form submission
router.post('/contact', async (req, res) => {
    const { full_name, email, subject, message } = req.body;

    if (!full_name || !email || !message) {
        return res.status(400).json({ error: 'Full name, email, and message are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO contact_submissions (full_name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [full_name, email, subject || '', message]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/submissions/complaint - Public complaint form submission
router.post('/complaint', async (req, res) => {
    const { full_name, email, phone, subject, description } = req.body;

    if (!full_name || !email || !description) {
        return res.status(400).json({ error: 'Full name, email, and description are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO complaint_submissions (full_name, email, phone, subject, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [full_name, email, phone || '', subject || '', description]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── ADMIN ROUTES (Protected) ──────────────────────────────────────────────────

// GET /api/submissions/contact - List all contact submissions
router.get('/contact', authenticate, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/submissions/complaint - List all complaint submissions
router.get('/complaint', authenticate, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM complaint_submissions ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/submissions/contact/:id - Update status (read, archive)
router.patch('/contact/:id', authenticate, async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE contact_submissions SET status = $1 WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/submissions/complaint/:id - Update status (investigating, resolved, etc)
router.patch('/complaint/:id', authenticate, async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE complaint_submissions SET status = $1 WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/submissions/contact/:id
router.delete('/contact/:id', authenticate, async (req, res) => {
    try {
        await pool.query('DELETE FROM contact_submissions WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/submissions/complaint/:id
router.delete('/complaint/:id', authenticate, async (req, res) => {
    try {
        await pool.query('DELETE FROM complaint_submissions WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

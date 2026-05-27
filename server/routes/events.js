const router = require('express').Router();
const pool = require('../db');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/events/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
 
// Multer setup for events cover images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/**
 * GET /api/events
 * Public, paginated, filterable by ?status and ?type
 */
router.get('/', async (req, res) => {
    try {
        const { status, type, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT *, COUNT(*) OVER() as total 
            FROM events 
            WHERE 1=1
        `;
        const params = [];

        if (status && status !== 'all') {
            params.push(status);
            query += ` AND status = $${params.length}`;
        }
        if (type && type !== 'all') {
            params.push(type);
            query += ` AND event_type = $${params.length}`;
        }

        query += ` ORDER BY starts_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), offset);

        const result = await pool.query(query, params);
        const total = result.rows.length > 0 ? parseInt(result.rows[0].total) : 0;
        
        res.json({
            data: result.rows,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/events/:id
 * Public, single event fetch
 */
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /api/events
 * Protected, multipart with cover_image upload
 */
router.post('/', authenticate, upload.single('cover_image'), async (req, res) => {
    const { 
        title, 
        description, 
        location, 
        map_url, 
        event_type, 
        status, 
        starts_at, 
        ends_at, 
        reg_url, 
        is_featured 
    } = req.body;

    if (!title || !starts_at) {
        return res.status(400).json({ error: 'Title and start date are required' });
    }

    const slug = slugify(title, { lower: true, strict: true });
    const cover_image = req.file ? `/uploads/events/${req.file.filename}` : null;

    try {
        const result = await pool.query(
            `INSERT INTO events (
                title, slug, description, location, map_url, event_type, status, starts_at, ends_at, cover_image, reg_url, is_featured
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [
                title, 
                slug, 
                description, 
                location, 
                map_url, 
                event_type || 'general', 
                status || 'upcoming', 
                starts_at, 
                ends_at || null, 
                cover_image, 
                reg_url, 
                is_featured === 'true' || is_featured === true
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'An event with this title already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

/**
 * PUT /api/events/:id
 * Protected, multipart, preserves existing cover if no new file
 */
router.put('/:id', authenticate, upload.single('cover_image'), async (req, res) => {
    const { 
        title, 
        description, 
        location, 
        map_url, 
        event_type, 
        status, 
        starts_at, 
        ends_at, 
        reg_url, 
        is_featured 
    } = req.body;
    
    try {
        const existing = await pool.query('SELECT cover_image, title FROM events WHERE id = $1', [req.params.id]);
        if (existing.rows.length === 0) return res.status(404).json({ error: 'Event not found' });

        const slug = title ? slugify(title, { lower: true, strict: true }) : undefined;
        const cover_image = req.file ? `/uploads/events/${req.file.filename}` : existing.rows[0].cover_image;

        const result = await pool.query(
            `UPDATE events SET 
                title = COALESCE($1, title), 
                slug = COALESCE($2, slug), 
                description = COALESCE($3, description), 
                location = COALESCE($4, location), 
                map_url = COALESCE($5, map_url), 
                event_type = COALESCE($6, event_type), 
                status = COALESCE($7, status), 
                starts_at = COALESCE($8, starts_at), 
                ends_at = $9, 
                cover_image = $10, 
                reg_url = COALESCE($11, reg_url), 
                is_featured = COALESCE($12, is_featured)
             WHERE id = $13 RETURNING *`,
            [
                title, 
                slug, 
                description, 
                location, 
                map_url, 
                event_type, 
                status, 
                starts_at, 
                ends_at || null, 
                cover_image, 
                reg_url, 
                is_featured === 'true' || is_featured === true, 
                req.params.id
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * DELETE /api/events/:id
 * Protected
 */
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Event not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

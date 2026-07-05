const router = require('express').Router();
const pool = require('../db');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendSubmissionNotification } = require('../mailer');

const membershipStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/membership/';
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const safeBase = path
            .basename(file.originalname, path.extname(file.originalname))
            .replace(/[^a-z0-9_-]+/gi, '-')
            .slice(0, 80);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBase}${path.extname(file.originalname)}`);
    }
});

const membershipUpload = multer({
    storage: membershipStorage,
    limits: { fileSize: 15 * 1024 * 1024, files: 16 },
    fileFilter: (req, file, cb) => {
        const allowed = /pdf|jpg|jpeg|png|webp|gif|svg|doc|docx/;
        const extOk = allowed.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
        const mimeOk =
            file.mimetype.startsWith('image/') ||
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        if (extOk && mimeOk) return cb(null, true);
        cb(new Error('Only PDF, Word, and image files are allowed'));
    }
});

const complaintStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/complaints/';
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const safeBase = path
            .basename(file.originalname, path.extname(file.originalname))
            .replace(/[^a-z0-9_-]+/gi, '-')
            .slice(0, 80);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBase}${path.extname(file.originalname)}`);
    }
});

const complaintUpload = multer({
    storage: complaintStorage,
    limits: { fileSize: 15 * 1024 * 1024, files: 8 },
    fileFilter: (req, file, cb) => {
        const allowed = /pdf|jpg|jpeg|png|webp|doc|docx/;
        const extOk = allowed.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
        const mimeOk =
            file.mimetype.startsWith('image/') ||
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        if (extOk && mimeOk) return cb(null, true);
        cb(new Error('Only PDF, Word, and image files are allowed'));
    }
});

const membershipFields = [
    { name: 'company_registration', maxCount: 1 },
    { name: 'pan_vat_certificate', maxCount: 1 },
    { name: 'moa_aoa', maxCount: 1 },
    { name: 'tax_clearance', maxCount: 1 },
    { name: 'ministry_approval', maxCount: 1 },
    { name: 'company_logo', maxCount: 1 },
    { name: 'owner_citizenship', maxCount: 1 },
    { name: 'other_documents', maxCount: 8 },
];

function serializeFiles(files = {}) {
    return Object.fromEntries(
        Object.entries(files).map(([field, uploaded]) => [
            field,
            uploaded.map((file) => ({
                original_name: file.originalname,
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size,
                url: `/uploads/membership/${file.filename}`,
            })),
        ])
    );
}

function serializeComplaintFiles(files = []) {
    return files.map((file) => ({
        original_name: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/complaints/${file.filename}`,
    }));
}

async function notifySubmission(payload) {
    try {
        await sendSubmissionNotification(payload);
    } catch (err) {
        console.error('Submission email notification failed:', err.message);
    }
}

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
        await notifySubmission({
            type: 'Contact Inquiry',
            subject: `New Contact Inquiry${subject ? `: ${subject}` : ''}`,
            fields: [
                ['Full Name', full_name],
                ['Email', email],
                ['Subject', subject || 'Contact inquiry'],
                ['Message', message],
            ],
        });
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/submissions/membership - Public membership application
router.post('/membership', membershipUpload.fields(membershipFields), async (req, res) => {
    const {
        membership_type,
        company_name,
        registration_number,
        pan_vat_number,
        established_year,
        company_address,
        province,
        district,
        city,
        website_url,
        office_phone,
        company_email,
        owner_name,
        owner_phone,
        owner_email,
        contact_person_name,
        contact_person_role,
        main_focus_countries,
        services_offered,
        destination_partners,
        counselor_count,
        annual_student_count,
        ministry_approval_status,
        message,
        agree_code_of_conduct,
    } = req.body;

    if (!company_name || !registration_number || !pan_vat_number || !company_email || !owner_name || !owner_email || !main_focus_countries || !services_offered) {
        return res.status(400).json({ error: 'Company, registration, owner, focus country, and service details are required' });
    }

    if (agree_code_of_conduct !== 'true') {
        return res.status(400).json({ error: 'Code of conduct declaration is required' });
    }

    try {
        const documents = serializeFiles(req.files);
        const result = await pool.query(
            `INSERT INTO membership_applications (
                membership_type, company_name, registration_number, pan_vat_number, established_year,
                company_address, province, district, city, website_url, office_phone, company_email,
                owner_name, owner_phone, owner_email, contact_person_name, contact_person_role,
                main_focus_countries, services_offered, destination_partners, counselor_count,
                annual_student_count, ministry_approval_status, message, agree_code_of_conduct, documents
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
                $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
            )
            RETURNING *`,
            [
                membership_type || 'General Member',
                company_name,
                registration_number,
                pan_vat_number,
                established_year ? parseInt(established_year, 10) : null,
                company_address || '',
                province || '',
                district || '',
                city || '',
                website_url || '',
                office_phone || '',
                company_email,
                owner_name,
                owner_phone || '',
                owner_email,
                contact_person_name || '',
                contact_person_role || '',
                main_focus_countries,
                services_offered,
                destination_partners || '',
                counselor_count ? parseInt(counselor_count, 10) : null,
                annual_student_count ? parseInt(annual_student_count, 10) : null,
                ministry_approval_status || '',
                message || '',
                true,
                documents,
            ]
        );
        await notifySubmission({
            type: 'Membership Application',
            subject: `New Membership Application: ${company_name}`,
            fields: [
                ['Membership Type', membership_type || 'General Member'],
                ['Company Name', company_name],
                ['Registration Number', registration_number],
                ['PAN/VAT Number', pan_vat_number],
                ['Established Year', established_year],
                ['Company Address', company_address],
                ['Province', province],
                ['District', district],
                ['City', city],
                ['Website URL', website_url],
                ['Office Phone', office_phone],
                ['Company Email', company_email],
                ['Owner Name', owner_name],
                ['Owner Phone', owner_phone],
                ['Owner Email', owner_email],
                ['Contact Person', contact_person_name],
                ['Contact Person Role', contact_person_role],
                ['Main Focus Countries', main_focus_countries],
                ['Services Offered', services_offered],
                ['Destination Partners', destination_partners],
                ['Counselor Count', counselor_count],
                ['Annual Student Count', annual_student_count],
                ['Ministry Approval Status', ministry_approval_status],
                ['Message', message],
            ],
            documents,
        });
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/submissions/complaint - Public complaint and feedback form submission
router.post('/complaint', complaintUpload.array('documents', 8), async (req, res) => {
    const {
        full_name,
        contact_number,
        email,
        relationship,
        communication_method,
        consultancy_name,
        branch_location,
        counselor_name,
        submission_type,
        issue_area,
        incident_date,
        study_country,
        description,
        expected_resolution,
        truth_declaration,
        process_declaration,
        privacy_declaration,
    } = req.body;

    if (!full_name || !contact_number || !relationship || !consultancy_name || !submission_type || !issue_area || !description) {
        return res.status(400).json({ error: 'Applicant, consultancy, submission type, issue area, and description are required' });
    }

    if (truth_declaration !== 'true' || process_declaration !== 'true' || privacy_declaration !== 'true') {
        return res.status(400).json({ error: 'All declarations are required' });
    }

    const reference_number = `ECAN-CF-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const safeEmail = email || 'not-provided@ecan.org.np';
    const subject = `${submission_type}: ${issue_area} - ${consultancy_name}`;

    try {
        const documents = serializeComplaintFiles(req.files);
        const result = await pool.query(
            `INSERT INTO complaint_submissions (
                full_name, email, phone, subject, description, reference_number,
                relationship, communication_method, consultancy_name, branch_location,
                counselor_name, submission_type, issue_area, incident_date, study_country,
                expected_resolution, truth_declaration, process_declaration, privacy_declaration,
                documents
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
            )
            RETURNING *`,
            [
                full_name,
                safeEmail,
                contact_number,
                subject,
                description,
                reference_number,
                relationship,
                communication_method || '',
                consultancy_name,
                branch_location || '',
                counselor_name || '',
                submission_type,
                issue_area,
                incident_date || null,
                study_country || '',
                expected_resolution || '',
                true,
                true,
                true,
                documents,
            ]
        );
        await notifySubmission({
            type: 'Complaint / Feedback',
            subject: `New Complaint / Feedback ${reference_number}: ${subject}`,
            fields: [
                ['Reference Number', reference_number],
                ['Full Name', full_name],
                ['Email', safeEmail],
                ['Phone', contact_number],
                ['Relationship', relationship],
                ['Preferred Communication Method', communication_method],
                ['Consultancy Name', consultancy_name],
                ['Branch Location', branch_location],
                ['Counselor Name', counselor_name],
                ['Submission Type', submission_type],
                ['Issue Area', issue_area],
                ['Incident Date', incident_date],
                ['Study Country', study_country],
                ['Description', description],
                ['Expected Resolution', expected_resolution],
            ],
            documents,
        });
        res.status(201).json({ success: true, reference_number, data: result.rows[0] });
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

// GET /api/submissions/membership - List all membership applications
router.get('/membership', authenticate, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM membership_applications ORDER BY created_at DESC');
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

// PATCH /api/submissions/membership/:id - Update membership application status
router.patch('/membership/:id', authenticate, async (req, res) => {
    const { status, internal_notes } = req.body;
    try {
        const result = await pool.query(
            'UPDATE membership_applications SET status = $1, internal_notes = COALESCE($2, internal_notes) WHERE id = $3 RETURNING *',
            [status, internal_notes || null, req.params.id]
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

// DELETE /api/submissions/membership/:id
router.delete('/membership/:id', authenticate, async (req, res) => {
    try {
        await pool.query('DELETE FROM membership_applications WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

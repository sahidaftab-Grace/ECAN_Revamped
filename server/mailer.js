const nodemailer = require('nodemailer')

const notifyEmail = process.env.SUBMISSION_NOTIFY_EMAIL || 'info@ecan.org.np'
const siteUrl = (process.env.SITE_URL || 'https://eps26.com').replace(/\/$/, '')

function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function getTransporter() {
  if (!isMailConfigured()) return null

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '-'
  if (Array.isArray(value)) return value.length ? value.join(', ') : '-'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

function flattenDocuments(documents) {
  if (!documents) return []
  if (Array.isArray(documents)) return documents
  return Object.values(documents).flat()
}

function buildHtml(title, fields, documents = []) {
  const rows = fields
    .map(([label, value]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:700;color:#0f172a;width:220px;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#334155;white-space:pre-wrap;">${escapeHtml(formatValue(value))}</td>
      </tr>
    `)
    .join('')

  const docs = flattenDocuments(documents)
  const docsHtml = docs.length
    ? `
      <h3 style="margin:24px 0 8px;color:#0f172a;">Uploaded documents</h3>
      <ul>
        ${docs.map((doc) => `<li><a href="${siteUrl}${doc.url}" style="color:#2563eb;">${escapeHtml(doc.original_name || doc.filename || doc.url)}</a></li>`).join('')}
      </ul>
    `
    : ''

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#334155;">
      <h2 style="color:#0f172a;">${escapeHtml(title)}</h2>
      <table style="border-collapse:collapse;width:100%;max-width:760px;border:1px solid #e5e7eb;">
        ${rows}
      </table>
      ${docsHtml}
      <p style="margin-top:24px;color:#64748b;font-size:13px;">This notification was sent automatically from ${escapeHtml(siteUrl)}.</p>
    </div>
  `
}

async function sendSubmissionNotification({ type, subject, fields, documents }) {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn('Email notification skipped: SMTP_HOST, SMTP_USER, and SMTP_PASS are required.')
    return
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  await transporter.sendMail({
    from,
    to: notifyEmail,
    replyTo: fields.find(([label]) => /email/i.test(label))?.[1] || undefined,
    subject: subject || `New ${type} submission`,
    html: buildHtml(`New ${type}`, fields, documents),
  })
}

module.exports = { sendSubmissionNotification }

const router = require('express').Router()
const pool = require('../db')
const { authenticate } = require('../middleware/auth')

const DEFAULT_HOME_HERO = {
  eyebrow: "Shaping the Nation's Future Through Global Education",
  title: "Empowering Nepal's",
  highlighted_text: 'Future Leaders',
  title_suffix: 'to Reach the World.',
  intro:
    "ECAN is the national heartbeat of Nepal's educational consultancies. Since 1997, we've guided over 100,000 students to international success through integrity and professional excellence.",
  primary_cta_label: 'Become a Member',
  primary_cta_url: '/contact',
  secondary_cta_label: 'Find a Consultancy',
  secondary_cta_url: '/members',
  trust_badges: ['Govt. Registered', 'Global Network', '600+ Members'],
  overlay_eyebrow: 'Our impact in focus',
  overlay_title: 'Bridging aspirations to global opportunities.',
  floating_value: '27+',
  floating_label: 'Years of Excellence',
  images: [],
}

const DEFAULT_HOME_STATS = {
  stats: [
    { target: 27, suffix: '+', label: 'Years of Trust', sub: 'Established 1997', color: 'primary' },
    { target: 600, suffix: '+', label: 'Accredited Members', sub: 'Verified Agencies', color: 'navy' },
    { target: 40, suffix: '+', label: 'Global Destinations', sub: 'Across 6 Continents', color: 'primary' },
    { target: 100, suffix: 'K+', label: 'Successful Students', sub: 'Global Impact', color: 'navy' },
  ],
}

const DEFAULT_HOME_PILLARS = {
  eyebrow: 'The Foundation of Trust',
  title: 'Four Pillars of Excellence',
  highlighted_text: 'Excellence',
  intro:
    "ECAN is the heartbeat of Nepal's educational consultancy sector. We don't just monitor — we lead, providing a platform where students can dream with absolute confidence.",
  cta_label: 'Learn More About Our Mission',
  cta_url: '/about',
  pillars: [
    {
      title: 'Verified Excellence',
      body: "Access Nepal's only vetted network of certified educational consultancies — every member held to ECAN's uncompromising code of ethics.",
      href: '/members',
      icon: 'badge-check',
    },
    {
      title: 'Industry Pulse',
      body: 'Stay ahead with global summits, policy dialogues, and professional workshops that define the future of outbound education.',
      href: '/events',
      icon: 'globe',
    },
    {
      title: 'Knowledge Hub',
      body: 'Master your practice with exclusive country briefs, counsellor handbooks, and research that keeps you at the cutting edge.',
      href: '/about',
      icon: 'library',
    },
    {
      title: 'Seamless Testing',
      body: 'Secure your future with our streamlined, member-trusted IELTS portal — built for speed, reliability, and student confidence.',
      href: '/contact',
      icon: 'pen-line',
    },
  ],
}

const DEFAULT_CONTACT_PAGE = {
  eyebrow: 'Contact ECAN',
  title: 'Get in Touch',
  highlighted_text: 'Touch',
  intro:
    'Send a general inquiry to the ECAN secretariat. Our team will review your message and respond through the appropriate channel.',
  side_eyebrow: 'Secretariat',
  side_title: 'General Information',
  side_intro: 'Use this page for general questions, coordination, official communication, and secretariat support.',
  address_label: 'Office Address',
  address: 'Hattisar, Kathmandu, Nepal',
  phone_label: 'Phone',
  phone: '+977-4521487 · +977-4522267',
  email_label: 'Email',
  email: 'info@ecan.org.np',
  hours_label: 'Office Hours',
  hours: 'Sunday to Friday, 10:00 AM - 5:00 PM',
  form_title: 'Send a Message',
  form_intro: 'Fill out the form below and the ECAN team will receive your inquiry in the admin backend.',
  success_title: 'Message Sent',
  success_message: 'Thank you. Your inquiry has been received by ECAN.',
}

const DEFAULT_ABOUT_PAGE = {
  hero_eyebrow: 'The ECAN Heritage',
  hero_title: 'A Vision for Students, A Tool for the Nation.',
  hero_highlighted_text: 'A Tool for the Nation.',
  hero_intro:
    'ECAN is more than an association; it is a promise of integrity to students, parents, and education providers worldwide since 1997.',
  identity_eyebrow: 'Our Core Identity',
  identity_title: "Nepal's Authoritative Voice in International Education.",
  identity_highlighted_text: 'International Education.',
  identity_intro:
    "Every year, thousands of young Nepalis leave home in pursuit of global opportunities. Behind every journey lies a dream, a family's trust, and a nation's future.",
  identity_body:
    'We are committed to ensuring that this journey is guided by transparency, accountability, and student-centered protection. Our vision is clear: to create an international education ecosystem where opportunity and security go hand in hand, empowering our youth to achieve their ambitions with confidence and peace of mind.',
  identity_image: '',
  stats: [
    { value: '27+', label: 'Years of Service', color: 'navy' },
    { value: '600+', label: 'Member Agencies', color: 'primary' },
  ],
  values_eyebrow: 'Guiding Principles',
  values_title: 'The Values that Define Us.',
  values_highlighted_text: 'Define Us.',
  values_intro:
    "Our commitment to ethical guidance ensures that every student's journey is handled with the highest standard of professionalism.",
  values: [
    { title: 'Integrity', body: 'Honest counsel before commercial interest, every time.', icon: 'award' },
    { title: 'Stewardship', body: 'Monitoring members so the sector keeps its standards high.', icon: 'shield-check' },
    { title: 'Advocacy', body: 'Speaking for Nepali students in policy rooms at home and abroad.', icon: 'trending-up' },
    { title: 'Care', body: "Treating every student's journey as a family decision.", icon: 'check-circle' },
  ],
  timeline_eyebrow: 'Historical Timeline',
  timeline_title: 'Twenty-Seven Years of Impactful Moments.',
  timeline_highlighted_text: 'Impactful Moments.',
  timeline_intro: 'Evolving from a local group to the national authority for educational consultancies.',
  milestones: [
    { year: '1997', text: 'Founded under the Chief District Administration Office, Kathmandu.' },
    { year: '2005', text: "Recognized by overseas education providers as Nepal's representative body." },
    { year: '2018', text: 'Launch of the ECAN mobile app for verified member discovery.' },
    { year: '2024', text: 'A renewed focus on transparent, accountable, and student-centered global education guidance.' },
  ],
  cta_title: 'Join the National Network',
  cta_intro:
    "If you are a consultancy committed to ethics and professional standards, become a part of Nepal's largest educational association.",
  primary_cta_label: 'Apply for Membership',
  primary_cta_url: '/contact',
  secondary_cta_label: 'View Member Directory',
  secondary_cta_url: '/members',
}

function getDefaultContent(section) {
  if (section === 'home-hero') return DEFAULT_HOME_HERO
  if (section === 'home-stats') return DEFAULT_HOME_STATS
  if (section === 'home-pillars') return DEFAULT_HOME_PILLARS
  if (section === 'contact-page') return DEFAULT_CONTACT_PAGE
  if (section === 'about-page') return DEFAULT_ABOUT_PAGE
  return {}
}

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      section text PRIMARY KEY,
      data jsonb NOT NULL DEFAULT '{}'::jsonb,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `)
}

router.get('/:section', async (req, res) => {
  try {
    await ensureTable()
    const result = await pool.query('SELECT data, updated_at FROM site_content WHERE section = $1', [req.params.section])

    if (!result.rows[0]) {
      return res.json({ section: req.params.section, data: getDefaultContent(req.params.section) })
    }

    res.json({
      section: req.params.section,
      data: result.rows[0]?.data || {},
      updated_at: result.rows[0]?.updated_at,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:section', authenticate, async (req, res) => {
  try {
    await ensureTable()
    const incoming = req.body?.data || req.body || {}
    const data = { ...getDefaultContent(req.params.section), ...incoming }

    const result = await pool.query(
      `INSERT INTO site_content (section, data, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (section)
       DO UPDATE SET data = EXCLUDED.data, updated_at = now()
       RETURNING section, data, updated_at`,
      [req.params.section, data],
    )

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

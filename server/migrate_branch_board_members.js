const pool = require('./db')

const BASE = 'https://ecan.org.np/media/uploads/board-member/'

const branches = [
  {
    slug: 'chitwan',
    name: 'Chitwan',
    province: 'Bagmati Province',
    color: 'from-emerald-700 to-emerald-900',
    accent: 'bg-emerald-500',
    contact: '056-493374',
    members: [
      ['Bhoj Bahadur Khadka', 'President', `${BASE}1.Bhoj_l7CWXMv.jpeg`],
      ['Founder President Name', 'Founder President', ''],
      ['Suraj Silwal', '1st Secretary', ''],
      ['Sadhana Pudasaini', 'Treasurer', ''],
    ],
  },
  {
    slug: 'kaski',
    name: 'Kaski',
    province: 'Gandaki Province',
    color: 'from-blue-700 to-blue-900',
    accent: 'bg-blue-500',
    contact: 'Pokhara',
    members: [
      ['Milan Tiwari', 'President', ''],
      ['Founder President Name', 'Founder President', ''],
      ['Rudra Prasad Aryal', 'Secretary', ''],
      ['Bhupal Thapa', 'Treasurer', ''],
    ],
  },
  {
    slug: 'lalitpur',
    name: 'Lalitpur',
    province: 'Bagmati Province',
    color: 'from-violet-700 to-violet-900',
    accent: 'bg-violet-500',
    contact: 'Kumaripati',
    members: [
      ['Sanam Kumar Maharjan', 'President', `${BASE}3._Sanam_Kumar_Maharjan_-_Secretary_qnYRz51.jpg`],
      ['Founder President Name', 'Founder President', ''],
      ['Mukunda Bajagai', 'Vice President', ''],
      ['Arbind Kumar Singh', 'Immediate Past President', ''],
    ],
  },
  {
    slug: 'purbanchal',
    name: 'Purbanchal',
    province: 'Koshi Province',
    color: 'from-orange-700 to-orange-900',
    accent: 'bg-orange-500',
    contact: 'Itahari',
    members: [
      ['Ravi Kumar Gupta', 'President', `${BASE}WhatsApp_Image_2025-12-14_at_16.50.15_NCO7QGs.jpeg`],
      ['Founder President Name', 'Founder President', ''],
      ['Durlav Karki', 'Secretary', ''],
      ['Gopal Niraula', 'Treasurer', ''],
    ],
  },
  {
    slug: 'rupandehi',
    name: 'Rupandehi',
    province: 'Lumbini Province',
    color: 'from-rose-700 to-rose-900',
    accent: 'bg-rose-500',
    contact: 'Butwal',
    members: [
      ['Om Prakash Gaihre', 'President', `${BASE}1._Om_Prakash_Gaihre_-_President.jpg`],
      ['Founder President Name', 'Founder President', ''],
      ['Ramesh K.C.', 'Secretary', ''],
      ['Ram Chandra Tolange', 'Treasurer', ''],
    ],
  },
  {
    slug: 'jhapa',
    name: 'Jhapa',
    province: 'Koshi Province',
    color: 'from-teal-700 to-teal-900',
    accent: 'bg-teal-500',
    contact: 'Birtamod',
    members: [
      ['Raj Kumar Karki', 'President', `${BASE}1_Raj_Kumar_Karki_-President_cGTO0nW.jpg`],
      ['Founder President Name', 'Founder President', ''],
      ['Roshan Subedi', 'Immediate Past President', ''],
      ['Ashok Bhandari', 'Executive Member', ''],
    ],
  },
  {
    slug: 'makwanpur',
    name: 'Makwanpur',
    province: 'Bagmati Province',
    color: 'from-amber-700 to-amber-900',
    accent: 'bg-amber-500',
    contact: 'Hetauda',
    members: [
      ['Bel Prasad Khatiwada', 'President', `${BASE}1_Bel_Prasad_Khatiwada_President.jpg`],
      ['Founder President Name', 'Founder President', ''],
      ['Manish Adhikari', 'Secretary', ''],
      ['Kishor Aryal', 'Treasurer', ''],
    ],
  },
  {
    slug: 'kavre',
    name: 'Kavre',
    province: 'Bagmati Province',
    color: 'from-cyan-700 to-cyan-900',
    accent: 'bg-cyan-500',
    contact: 'Banepa',
    members: [
      ['Bhuwan Rayamajhi', 'President', `${BASE}01_Bhuwan_Rayamajhi_-_President.jpg`],
      ['Founder President Name', 'Founder President', ''],
      ['Bal Krishna Neupane', 'Secretary', ''],
      ['Sharmila Timalsina', 'Vice President', ''],
    ],
  },
]

async function migrate() {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS branch_board_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        branch_slug TEXT NOT NULL,
        branch_name TEXT NOT NULL,
        province TEXT DEFAULT '',
        color TEXT DEFAULT 'from-slate-700 to-slate-900',
        accent TEXT DEFAULT 'bg-slate-500',
        contact TEXT DEFAULT '',
        member_name TEXT NOT NULL,
        role TEXT NOT NULL,
        image_url TEXT DEFAULT '',
        sort_order INTEGER DEFAULT 0,
        branch_sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(branch_slug, member_name, role)
      )
    `)

    for (const [branchIndex, branch] of branches.entries()) {
      for (const [memberIndex, member] of branch.members.entries()) {
        const [memberName, role, imageUrl] = member
        await pool.query(
          `INSERT INTO branch_board_members
           (branch_slug, branch_name, province, color, accent, contact, member_name, role, image_url, sort_order, branch_sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (branch_slug, member_name, role)
           DO UPDATE SET
             branch_name = EXCLUDED.branch_name,
             province = EXCLUDED.province,
             color = EXCLUDED.color,
             accent = EXCLUDED.accent,
             contact = EXCLUDED.contact,
             sort_order = EXCLUDED.sort_order,
             branch_sort_order = EXCLUDED.branch_sort_order`,
          [
            branch.slug,
            branch.name,
            branch.province,
            branch.color,
            branch.accent,
            branch.contact,
            memberName,
            role,
            imageUrl,
            memberIndex,
            branchIndex,
          ]
        )
      }
    }

    console.log('Branch board migration completed successfully.')
  } catch (err) {
    console.error('Branch board migration failed:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

migrate()

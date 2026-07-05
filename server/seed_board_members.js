const pool = require('./db')

const boardMembers = [
  {
    name: 'Laxman Poudel (Andrew)',
    role: 'President',
    category: 'officer',
    sort_order: 1,
    email: 'president@ecan.org.np',
    phone: '+977-1-4521487',
    bio: "Laxman Poudel (Andrew) is a seasoned education consultant with over two decades of experience guiding Nepali students into international higher education. As President, he champions ethical consultancy, student security, institutional accountability, and globally connected opportunities.",
    quote: 'Pursuing education abroad is a leap of faith. My mission is to turn that leap into a confident step.',
  },
  {
    name: 'Seshraj Bhattarai',
    role: 'Immediate Past President',
    category: 'officer',
    sort_order: 2,
    bio: "Seshraj Bhattarai served as ECAN President during 2022-2024, overseeing significant growth in membership and the launch of ECAN's digital infrastructure. His tenure strengthened relationships with international education partners.",
    quote: 'The foundation we built together will carry ECAN forward for generations.',
  },
  {
    name: 'Bashu Deb Dahal',
    role: '1st Vice President',
    category: 'officer',
    sort_order: 3,
    bio: "Bashu Deb Dahal brings extensive experience in student counselling and institutional partnerships. He oversees ECAN's member relations and professional development programmes.",
    quote: 'Professional excellence is a daily commitment.',
  },
  {
    name: 'Bikalp Raj Pokhrel',
    role: '2nd Vice President',
    category: 'officer',
    sort_order: 4,
    bio: "Bikalp Raj Pokhrel is responsible for ECAN's policy advocacy and government relations. He has been instrumental in shaping Nepal's outbound education policy framework.",
    quote: 'Policy shapes the environment in which students dream. We must shape it wisely.',
  },
  {
    name: 'Geeta Siwakoti',
    role: '3rd Vice President',
    category: 'officer',
    sort_order: 5,
    bio: 'Geeta Siwakoti leads ECAN gender equity and student welfare initiatives. She has championed programmes to support female students and first-generation international students.',
    quote: "Every student deserves equal access to the world's opportunities.",
  },
  {
    name: 'Bhaba Nath Humagai',
    role: 'General Secretary',
    category: 'officer',
    sort_order: 6,
    email: 'secretary@ecan.org.np',
    phone: '+977-1-4522267',
    bio: "Bhaba Nath Humagai manages ECAN's day-to-day operations and strategic communications. He coordinates between the executive board, member consultancies, and external partners.",
    quote: 'Good governance is the backbone of every trusted institution.',
  },
  {
    name: 'Suraj Silwal',
    role: '1st Secretary',
    category: 'officer',
    sort_order: 7,
    bio: "Suraj Silwal supports ECAN's secretariat functions and manages the association's event calendar and member communications, including the Annual Day and EduClave.",
    quote: 'Every great event begins with meticulous preparation.',
  },
  {
    name: 'Ashik Karki',
    role: '2nd Secretary',
    category: 'officer',
    sort_order: 8,
    bio: "Ashik Karki manages ECAN's digital communications, social media presence, and member directory. He has been central to ECAN's digital transformation and member-facing online services.",
    quote: 'Digital tools amplify our reach, but trust is still built person to person.',
  },
  {
    name: 'Sadhana Pudasaini',
    role: 'Treasurer',
    category: 'officer',
    sort_order: 9,
    bio: "Sadhana Pudasaini oversees ECAN's financial management, budgeting, and audit processes. Her rigorous approach to financial governance has strengthened ECAN's institutional credibility.",
    quote: 'Financial integrity is the foundation of institutional trust.',
  },
  {
    name: 'Govinda Khanal',
    role: 'Joint Treasurer',
    category: 'officer',
    sort_order: 10,
    bio: "Govinda Khanal supports ECAN's financial operations and manages the scholarship fund and member fee collections, ensuring accurate financial reporting and compliance.",
    quote: 'Every rupee managed well is a step toward a stronger association.',
  },
  ['Ananta Raj Ghimire', 'Executive Member', 'executive', 11],
  ['Uddab Ban', 'Executive Member', 'executive', 12],
  ['Vivek Basnet', 'Executive Member', 'executive', 13],
  ['Damodar Sharma', 'Executive Member', 'executive', 14],
  ['Ashok Kumar Hathi', 'Executive Member', 'executive', 15],
  ['Dinesh Paudel', 'Executive Member', 'executive', 16],
  ['Sanjeev Pandey', 'Executive Member', 'executive', 17],
  ['Shiva Prasad Aryal', 'Executive Member', 'executive', 18],
  ['Kamal Prasad Timalsina', 'Executive Member', 'executive', 19],
  ['Pradip Bhusal', 'Executive Member', 'executive', 20],
  ['Sudip KC', 'Executive Member', 'executive', 21],
  ['Ravi Kumar Gupta', 'Executive Member', 'executive', 22],
  ['Govinda Basnet', 'Executive Member', 'executive', 23],
  ['Raj Kumar Karki', 'Executive Member', 'executive', 24],
  ['Bel Prasad Khatiwada', 'Executive Member', 'executive', 25],
  ['Bhuwan Rayamajhi', 'Executive Member', 'executive', 26],
  ['Bhoj Bahadur Khadka', 'Member by Post', 'executive', 27],
  ['Om Prakash Gaihre', 'Member by Post', 'executive', 28],
  ['Sanam Kumar Maharjan', 'Member by Post', 'executive', 29],
  ['Mr. Arun Lamichhane', 'Chairperson - ECAN Advisory Committee', 'advisory', 50],
  ['Mr. Mahesh Kumar Karki', 'Member - ECAN Advisory Committee', 'advisory', 51],
  ['Mr. Saroj Kumar Basnet', 'Member - ECAN Advisory Committee', 'advisory', 52],
  ['Mr. Raju Prasad Dallakoti', 'Member - ECAN Advisory Committee', 'advisory', 53],
  ['Mr. Thirlal Bhatta', 'Member - ECAN Advisory Committee', 'advisory', 54],
  ['Mr. Devi Das Bhattarai', 'Member - ECAN Advisory Committee', 'advisory', 55],
  ['Mr. Prakash Shrestha', 'Member - ECAN Advisory Committee', 'advisory', 56],
  ['Ms. Yasoda Bhattarai', 'Member - ECAN Advisory Committee', 'advisory', 57],
  ['Ms. Nirupama Maharjan', 'Member - ECAN Advisory Committee', 'advisory', 58],
  ['Ms. Rajani Shrestha', 'Member - ECAN Advisory Committee', 'advisory', 59],
  ['Ms. Sapana Rajbhandari', 'Member - ECAN Advisory Committee', 'advisory', 60],
  ['Mr. Mahesh Bhandari', 'Member - ECAN Advisory Committee', 'advisory', 61],
  ['Mr. Upendra Dev Dhakal', 'Member - ECAN Advisory Committee', 'advisory', 62],
  ['Mr. Daya Ram Thapa', 'Member - ECAN Advisory Committee', 'advisory', 63],
  ['Mr. Koshraj Giri', 'Member - ECAN Advisory Committee', 'advisory', 64],
  ['Deepak Gurung', 'Chairperson - ECAN Past Presidential Council', 'past-presidential', 100],
  ['Rajendra Baral', 'Member - ECAN Past Presidential Council', 'past-presidential', 101],
  ['Arun Lamichhane', 'Member - ECAN Past Presidential Council', 'past-presidential', 102],
  ['Buddhi Prasad Regmi', 'Member - ECAN Past Presidential Council', 'past-presidential', 103],
  ['Prakash Pandey', 'Member - ECAN Past Presidential Council', 'past-presidential', 104],
  ['Bishnu Hari Pandey', 'Member - ECAN Past Presidential Council', 'past-presidential', 105],
].map((member) => {
  if (Array.isArray(member)) {
    const [name, role, category, sort_order] = member
    return { name, role, category, sort_order }
  }

  return member
})

async function seedBoardMembers() {
  try {
    console.log('Seeding board members...')

    for (const member of boardMembers) {
      await pool.query(
        `
        INSERT INTO board_members
          (name, role, term, sort_order, category, email, phone, bio, quote)
        SELECT $1, $2, 'current', $3, $4, $5, $6, $7, $8
        WHERE NOT EXISTS (
          SELECT 1 FROM board_members WHERE LOWER(name) = LOWER($1)
        )
        `,
        [
          member.name,
          member.role,
          member.sort_order,
          member.category,
          member.email || '',
          member.phone || '',
          member.bio || '',
          member.quote || '',
        ],
      )

      await pool.query(
        `
        UPDATE board_members
        SET category = COALESCE(NULLIF(category, ''), $2),
            sort_order = CASE WHEN COALESCE(sort_order, 0) = 0 THEN $3 ELSE sort_order END,
            email = CASE WHEN COALESCE(email, '') = '' THEN $4 ELSE email END,
            phone = CASE WHEN COALESCE(phone, '') = '' THEN $5 ELSE phone END,
            bio = CASE WHEN COALESCE(bio, '') = '' THEN $6 ELSE bio END,
            quote = CASE WHEN COALESCE(quote, '') = '' THEN $7 ELSE quote END
        WHERE LOWER(name) = LOWER($1)
        `,
        [
          member.name,
          member.category,
          member.sort_order,
          member.email || '',
          member.phone || '',
          member.bio || '',
          member.quote || '',
        ],
      )
    }

    console.log('Board member seed complete.')
  } catch (err) {
    console.error('Board member seed failed:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

seedBoardMembers()

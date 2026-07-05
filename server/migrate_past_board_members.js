const pool = require('./db')

const pastBoards = [
  {
    term: '2022-2024',
    president: 'Seshraj Bhattarai',
    members: [
      ['Seshraj Bhattarai', 'President'],
      ['Laxman Poudel (Andrew)', '1st Vice President'],
      ['Bashu Deb Dahal', '2nd Vice President'],
      ['Bikalp Raj Pokhrel', 'General Secretary'],
      ['Bhaba Nath Humagai', '1st Secretary'],
      ['Suraj Silwal', '2nd Secretary'],
      ['Sadhana Pudasaini', 'Treasurer'],
      ['Govinda Khanal', 'Joint Treasurer'],
    ],
  },
  {
    term: '2020-2022',
    president: 'Rajesh Shrestha',
    members: [
      ['Rajesh Shrestha', 'President'],
      ['Seshraj Bhattarai', '1st Vice President'],
      ['Narayan Prasad Ghimire', '2nd Vice President'],
      ['Dipak Raj Joshi', 'General Secretary'],
      ['Ramesh Kumar Thapa', '1st Secretary'],
      ['Sunita Karmacharya', '2nd Secretary'],
      ['Binod Prasad Adhikari', 'Treasurer'],
      ['Prabha Devi Shrestha', 'Joint Treasurer'],
    ],
  },
  {
    term: '2018-2020',
    president: 'Narayan Prasad Ghimire',
    members: [
      ['Narayan Prasad Ghimire', 'President'],
      ['Rajesh Shrestha', '1st Vice President'],
      ['Hari Prasad Lamsal', '2nd Vice President'],
      ['Dipak Raj Joshi', 'General Secretary'],
      ['Binod Prasad Adhikari', '1st Secretary'],
      ['Kamala Devi Poudel', '2nd Secretary'],
      ['Ramesh Kumar Thapa', 'Treasurer'],
      ['Sunita Karmacharya', 'Joint Treasurer'],
    ],
  },
  {
    term: '2016-2018',
    president: 'Hari Prasad Lamsal',
    members: [
      ['Hari Prasad Lamsal', 'President'],
      ['Narayan Prasad Ghimire', '1st Vice President'],
      ['Mohan Bahadur Thapa', '2nd Vice President'],
      ['Rajesh Shrestha', 'General Secretary'],
      ['Kamala Devi Poudel', '1st Secretary'],
      ['Dipak Raj Joshi', '2nd Secretary'],
      ['Sunita Karmacharya', 'Treasurer'],
      ['Binod Prasad Adhikari', 'Joint Treasurer'],
    ],
  },
  {
    term: '2014-2016',
    president: 'Mohan Bahadur Thapa',
    members: [
      ['Mohan Bahadur Thapa', 'President'],
      ['Hari Prasad Lamsal', '1st Vice President'],
      ['Shyam Prasad Acharya', '2nd Vice President'],
      ['Narayan Prasad Ghimire', 'General Secretary'],
      ['Rajesh Shrestha', '1st Secretary'],
      ['Kamala Devi Poudel', '2nd Secretary'],
      ['Dipak Raj Joshi', 'Treasurer'],
      ['Ramesh Kumar Thapa', 'Joint Treasurer'],
    ],
  },
  {
    term: '2012-2014',
    president: 'Shyam Prasad Acharya',
    members: [
      ['Shyam Prasad Acharya', 'President'],
      ['Mohan Bahadur Thapa', '1st Vice President'],
      ['Krishna Prasad Dhakal', '2nd Vice President'],
      ['Hari Prasad Lamsal', 'General Secretary'],
      ['Narayan Prasad Ghimire', '1st Secretary'],
      ['Rajesh Shrestha', '2nd Secretary'],
      ['Kamala Devi Poudel', 'Treasurer'],
      ['Dipak Raj Joshi', 'Joint Treasurer'],
    ],
  },
]

async function migrate() {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS past_board_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        term TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        image_url TEXT DEFAULT '',
        sort_order INTEGER DEFAULT 0,
        term_sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(term, name, role)
      )
    `)

    for (const [termIndex, board] of pastBoards.entries()) {
      for (const [memberIndex, [name, role]] of board.members.entries()) {
        await pool.query(
          `INSERT INTO past_board_members
           (term, name, role, sort_order, term_sort_order)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (term, name, role)
           DO UPDATE SET
             sort_order = EXCLUDED.sort_order,
             term_sort_order = EXCLUDED.term_sort_order`,
          [board.term, name, role, memberIndex, termIndex]
        )
      }
    }

    console.log('Past board migration completed successfully.')
  } catch (err) {
    console.error('Past board migration failed:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

migrate()

const pool = require('./db')

const posts = [
  {
    slug: 'ecan-smart-2-launch',
    title: 'ECAN Strengthens Ethical Consultancy and Student Protection',
    excerpt:
      "ECAN's renewed framework sets a new benchmark for transparency and student welfare in Nepal's outbound education sector.",
    content:
      "The Educational Consultancy Association of Nepal (ECAN) has strengthened its ethical consultancy and student protection framework to elevate standards across member consultancies.\n\nThe framework focuses on three pillars: student security, information integrity, and institutional accountability. All ECAN member consultancies are required to comply with the new standards by mid-2025.\n\nPresident Laxman Poudel (Andrew) stated that this renewed focus represents a generational shift in how Nepal's education consultancy sector operates. The framework introduces annual reviews, a public complaints portal, and a verified member badge system that students and parents can use to identify trustworthy consultancies.\n\nThe launch event was attended by over 300 member consultancies, government representatives, and international education partners. The initiative has already received endorsement from the Ministry of Education, Science and Technology.",
    date: '2025-03-15',
    category: 'announcement',
    cover_image: '/assets/Hero_image-BkXeSTD6.jpeg',
    images: ['/assets/ecan_election-CI8vdFn5.jpg', '/assets/gallery7-D29_Ru7m.jpeg'],
    layout: 'hero-image',
    author: 'ECAN Secretariat',
  },
  {
    slug: '27th-annual-day',
    title: '27th ECAN Annual Day Celebrated at Hotel Everest',
    excerpt:
      'Over 400 members, partners and dignitaries gathered to mark 27 years of guiding Nepali students into international higher education.',
    content:
      "The 27th ECAN Annual Day was held at Hotel Everest, New Baneshwor, Kathmandu. The event brought together member consultancies, university representatives, and government officials to celebrate the association's journey since 1997.\n\nPresident Laxman Poudel (Andrew) delivered the keynote address, highlighting ECAN's commitment to student welfare and ethical practice. The evening featured recognition awards for outstanding member consultancies and a cultural programme celebrating Nepal's educational achievements.\n\nGuest speakers included representatives from the British Council, IDP Education, and the Australian High Commission. The event also marked the formal launch of ECAN's new digital member directory, which allows students to verify the credentials of any registered consultancy.\n\nThe 16th Annual Picnic was also announced for the following month at Dusit Thani Himalayan Resort, continuing ECAN's tradition of community building among its members.",
    date: '2025-02-20',
    category: 'event',
    cover_image: '/assets/president_picnic-CC1C2ruE.jpg',
    images: [
      '/assets/ecan_election-CI8vdFn5.jpg',
      '/assets/gallery9-H9hAH-B8.jpeg',
      '/assets/gallery7-D29_Ru7m.jpeg',
    ],
    layout: 'magazine',
    author: 'ECAN Communications',
  },
  {
    slug: 'moe-partnership-2025',
    title: 'ECAN Signs MoU with Ministry of Education for Student Protection',
    excerpt:
      'A landmark agreement strengthens collaboration between ECAN and the Ministry of Education to safeguard Nepali students studying abroad.',
    content:
      "ECAN has signed a Memorandum of Understanding with Nepal's Ministry of Education, Science and Technology to establish a joint framework for monitoring and protecting Nepali students enrolled in foreign universities.\n\nThe MoU includes provisions for a grievance redressal mechanism, a shared database of verified institutions, and a rapid response protocol for students facing difficulties abroad. This is the first formal agreement of its kind between a private education association and the Ministry.\n\nThe signing ceremony was attended by the Minister of Education, ECAN President Laxman Poudel (Andrew), and representatives from Nepal's diplomatic missions in Australia, the UK, Canada, and Japan.\n\nUnder the agreement, ECAN will provide the Ministry with quarterly reports on student welfare incidents and will collaborate on a national awareness campaign targeting students and parents in rural areas who may be vulnerable to fraudulent consultancies.",
    date: '2025-01-10',
    category: 'partnership',
    cover_image: '/assets/ecan_protocal -W63g5d--.jpg',
    images: ['/assets/Hero_image-BkXeSTD6.jpeg'],
    layout: 'split',
    author: 'ECAN Secretariat',
  },
  {
    slug: 'educlave-2-policy',
    title: "EduClave 2.0 Policy Dialogue Shapes Nepal's Education Export Strategy",
    excerpt:
      "Key stakeholders convened at Marriott Hotel to draft recommendations for Nepal's outbound education policy framework.",
    content:
      "EduClave 2.0, ECAN's flagship policy dialogue, brought together education ministers, university representatives, and consultancy leaders to address the challenges and opportunities in Nepal's outbound education sector.\n\nThe dialogue produced a set of policy recommendations that will be submitted to the Ministry of Education for consideration. Key recommendations include the establishment of a national student insurance scheme, mandatory pre-departure orientation programmes, and a bilateral recognition framework with destination countries.\n\nOver 150 delegates participated across two days of panel discussions, workshops, and networking sessions. International speakers joined virtually from the UK, Australia, Canada, Germany, and Japan.\n\nThe recommendations document will be published on the ECAN website and shared with all member consultancies. A follow-up dialogue is planned for late 2025 to review progress on implementation.",
    date: '2024-11-28',
    category: 'policy',
    cover_image: '/assets/gallery9-H9hAH-B8.jpeg',
    images: ['/assets/ecan_election-CI8vdFn5.jpg', '/assets/ecan_protocal -W63g5d--.jpg'],
    layout: 'hero-image',
    author: 'ECAN Policy Team',
  },
  {
    slug: 'icef-recognition-2024',
    title: 'ECAN Receives ICEF Recognition for Quality Standards',
    excerpt:
      'International Consultants for Education and Fairs (ICEF) has recognised ECAN as a leading association for quality assurance in student recruitment.',
    content:
      "ECAN has been formally recognised by ICEF for its commitment to quality standards in international student recruitment. The recognition acknowledges ECAN's rigorous member vetting process, its code of ethics, and its ongoing professional development programmes for member consultancies.\n\nICEF, the world's leading network for international student recruitment professionals, evaluated ECAN against a global benchmark of 47 criteria covering governance, ethics, member services, and student outcomes. ECAN scored in the top 10% of associations evaluated in the Asia-Pacific region.\n\nThe recognition comes with access to ICEF's global network of over 6,000 education institutions and agents, opening new partnership opportunities for ECAN members. It also qualifies ECAN members for preferential access to ICEF workshops in Berlin, Miami, and Sydney.\n\nThis is the second consecutive year ECAN has received ICEF recognition, reflecting the association's sustained commitment to raising standards across Nepal's education consultancy sector.",
    date: '2024-10-05',
    category: 'award',
    cover_image: '/assets/gallery7-D29_Ru7m.jpeg',
    images: ['/assets/Hero_image-BkXeSTD6.jpeg', '/assets/gallery9-H9hAH-B8.jpeg'],
    layout: 'split',
    author: 'ECAN Communications',
  },
  {
    slug: 'branch-expansion-2024',
    title: 'ECAN Expands Branch Network with Two New Regional Offices',
    excerpt:
      "New branches in Dharan and Pokhara strengthen ECAN's presence across Nepal's major education hubs.",
    content:
      "ECAN has inaugurated two new regional branches in Dharan and Pokhara, bringing the total number of active branches to ten. The expansion is part of ECAN's strategic plan to provide localised support to students and consultancies across Nepal's major cities.\n\nThe Pokhara branch will serve the Gandaki Province, covering Kaski, Lamjung, Syangya, and surrounding districts. The Dharan branch will serve the eastern Koshi Province, complementing the existing Jhapa and Purbanchal branches.\n\nEach new branch has an elected executive committee of seven members and will hold quarterly regional events, workshops, and student counselling sessions. The branches will also serve as local points of contact for ECAN's complaints and student support channels.\n\nWith ten active branches, ECAN now has a physical presence in all seven provinces of Nepal, fulfilling a key objective of the 2022-2026 strategic plan.",
    date: '2024-08-18',
    category: 'announcement',
    cover_image: '/assets/himalaya-mist-LBqW6bPy.jpg',
    images: ['/assets/ecan_election-CI8vdFn5.jpg', '/assets/president_picnic-CC1C2ruE.jpg'],
    layout: 'magazine',
    author: 'ECAN Secretariat',
  },
]

async function seed() {
  try {
    for (const post of posts) {
      await pool.query(
        `INSERT INTO news_posts
          (slug, title, excerpt, content, author, category, date, published, layout, cover_image, images)
         VALUES
          ($1, $2, $3, $4, $5, $6, $7, true, $8, $9, $10)
         ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          author = EXCLUDED.author,
          category = EXCLUDED.category,
          date = EXCLUDED.date,
          published = EXCLUDED.published,
          layout = EXCLUDED.layout,
          cover_image = EXCLUDED.cover_image,
          images = EXCLUDED.images`,
        [
          post.slug,
          post.title,
          post.excerpt,
          post.content,
          post.author,
          post.category,
          post.date,
          post.layout,
          post.cover_image,
          post.images,
        ]
      )
    }

    const result = await pool.query('SELECT COUNT(*)::int AS count FROM news_posts')
    console.log(`News posts ready: ${result.rows[0].count}`)
  } finally {
    await pool.end()
  }
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

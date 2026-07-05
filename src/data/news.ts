import ecanElection from "@/assets/ecan_election.jpg";
import ecanProtocol from "@/assets/ecan_protocal .jpg";
import presidentPicnic from "@/assets/president_picnic.jpg";
import gallery7 from "@/assets/gallery7.jpeg";
import gallery9 from "@/assets/gallery9.jpeg";
import heroImage from "@/assets/Hero_image.jpeg";
import himalaya from "@/assets/himalaya-mist.jpg";
import img1 from "@/assets/1.jpeg";
import img2 from "@/assets/2.jpeg";
import img3 from "@/assets/3.jpg";
import img4 from "@/assets/4.jpg";
import img6 from "@/assets/6.jpg";
import img7 from "@/assets/7.jpeg";

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: "announcement" | "policy" | "event" | "partnership" | "award";
  image: string | null;
  images?: string[];
  layout?: "classic" | "hero-image" | "split" | "magazine";
  author: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: "guide" | "destination" | "visa" | "scholarship" | "career" | "tips";
  image: string | null;
  images?: string[];
  layout?: "classic" | "hero-image" | "split" | "magazine";
  author: string;
  readTime: number;
}

export const newsItems: NewsItem[] = [
  {
    id: "ecan-ethical-consultancy-framework",
    title: "ECAN Strengthens Ethical Consultancy and Student Protection",
    excerpt:
      "ECAN's renewed framework sets a new benchmark for transparency and student welfare in Nepal's outbound education sector.",
    content:
      "The Educational Consultancy Association of Nepal (ECAN) has strengthened its ethical consultancy and student protection framework to elevate standards across member consultancies.\n\nThe framework focuses on three pillars: student security, information integrity, and institutional accountability. All ECAN member consultancies are required to comply with the new standards by mid-2025.\n\nPresident Laxman Poudel (Andrew) stated that this renewed focus represents a generational shift in how Nepal's education consultancy sector operates. The framework introduces annual reviews, a public complaints portal, and a verified member badge system that students and parents can use to identify trustworthy consultancies.\n\nThe launch event was attended by over 300 member consultancies, government representatives, and international education partners. The initiative has already received endorsement from the Ministry of Education, Science and Technology.",
    date: "2025-03-15",
    category: "announcement",
    image: heroImage,
    images: [ecanElection, gallery7],
    layout: "hero-image",
    author: "ECAN Secretariat",
  },
  {
    id: "27th-annual-day",
    title: "27th ECAN Annual Day Celebrated at Hotel Everest",
    excerpt:
      "Over 400 members, partners and dignitaries gathered to mark 27 years of guiding Nepali students into international higher education.",
    content:
      "The 27th ECAN Annual Day was held at Hotel Everest, New Baneshwor, Kathmandu. The event brought together member consultancies, university representatives, and government officials to celebrate the association's journey since 1997.\n\nPresident Laxman Poudel (Andrew) delivered the keynote address, highlighting ECAN's commitment to student welfare and ethical practice. The evening featured recognition awards for outstanding member consultancies and a cultural programme celebrating Nepal's educational achievements.\n\nGuest speakers included representatives from the British Council, IDP Education, and the Australian High Commission. The event also marked the formal launch of ECAN's new digital member directory, which allows students to verify the credentials of any registered consultancy.\n\nThe 16th Annual Picnic was also announced for the following month at Dusit Thani Himalayan Resort, continuing ECAN's tradition of community building among its members.",
    date: "2025-02-20",
    category: "event",
    image: presidentPicnic,
    images: [ecanElection, gallery9, gallery7],
    layout: "magazine",
    author: "ECAN Communications",
  },
  {
    id: "moe-partnership-2025",
    title: "ECAN Signs MoU with Ministry of Education for Student Protection",
    excerpt:
      "A landmark agreement strengthens collaboration between ECAN and the Ministry of Education to safeguard Nepali students studying abroad.",
    content:
      "ECAN has signed a Memorandum of Understanding with Nepal's Ministry of Education, Science and Technology to establish a joint framework for monitoring and protecting Nepali students enrolled in foreign universities.\n\nThe MoU includes provisions for a grievance redressal mechanism, a shared database of verified institutions, and a rapid response protocol for students facing difficulties abroad. This is the first formal agreement of its kind between a private education association and the Ministry.\n\nThe signing ceremony was attended by the Minister of Education, ECAN President Laxman Poudel (Andrew), and representatives from Nepal's diplomatic missions in Australia, the UK, Canada, and Japan.\n\nUnder the agreement, ECAN will provide the Ministry with quarterly reports on student welfare incidents and will collaborate on a national awareness campaign targeting students and parents in rural areas who may be vulnerable to fraudulent consultancies.",
    date: "2025-01-10",
    category: "partnership",
    image: ecanProtocol,
    images: [heroImage],
    layout: "split",
    author: "ECAN Secretariat",
  },
  {
    id: "educlave-2-policy",
    title: "EduClave 2.0 Policy Dialogue Shapes Nepal's Education Export Strategy",
    excerpt:
      "Key stakeholders convened at Marriott Hotel to draft recommendations for Nepal's outbound education policy framework.",
    content:
      "EduClave 2.0, ECAN's flagship policy dialogue, brought together education ministers, university representatives, and consultancy leaders to address the challenges and opportunities in Nepal's outbound education sector.\n\nThe dialogue produced a set of policy recommendations that will be submitted to the Ministry of Education for consideration. Key recommendations include the establishment of a national student insurance scheme, mandatory pre-departure orientation programmes, and a bilateral recognition framework with destination countries.\n\nOver 150 delegates participated across two days of panel discussions, workshops, and networking sessions. International speakers joined virtually from the UK, Australia, Canada, Germany, and Japan.\n\nThe recommendations document will be published on the ECAN website and shared with all member consultancies. A follow-up dialogue is planned for late 2025 to review progress on implementation.",
    date: "2024-11-28",
    category: "policy",
    image: gallery9,
    images: [ecanElection, ecanProtocol],
    layout: "hero-image",
    author: "ECAN Policy Team",
  },
  {
    id: "icef-recognition-2024",
    title: "ECAN Receives ICEF Recognition for Quality Standards",
    excerpt:
      "International Consultants for Education and Fairs (ICEF) has recognised ECAN as a leading association for quality assurance in student recruitment.",
    content:
      "ECAN has been formally recognised by ICEF for its commitment to quality standards in international student recruitment. The recognition acknowledges ECAN's rigorous member vetting process, its code of ethics, and its ongoing professional development programmes for member consultancies.\n\nICEF, the world's leading network for international student recruitment professionals, evaluated ECAN against a global benchmark of 47 criteria covering governance, ethics, member services, and student outcomes. ECAN scored in the top 10% of associations evaluated in the Asia-Pacific region.\n\nThe recognition comes with access to ICEF's global network of over 6,000 education institutions and agents, opening new partnership opportunities for ECAN members. It also qualifies ECAN members for preferential access to ICEF workshops in Berlin, Miami, and Sydney.\n\nThis is the second consecutive year ECAN has received ICEF recognition, reflecting the association's sustained commitment to raising standards across Nepal's education consultancy sector.",
    date: "2024-10-05",
    category: "award",
    image: gallery7,
    images: [heroImage, gallery9],
    layout: "split",
    author: "ECAN Communications",
  },
  {
    id: "branch-expansion-2024",
    title: "ECAN Expands Branch Network with Two New Regional Offices",
    excerpt:
      "New branches in Dharan and Pokhara strengthen ECAN's presence across Nepal's major education hubs.",
    content:
      "ECAN has inaugurated two new regional branches in Dharan and Pokhara, bringing the total number of active branches to ten. The expansion is part of ECAN's strategic plan to provide localised support to students and consultancies across Nepal's major cities.\n\nThe Pokhara branch will serve the Gandaki Province, covering Kaski, Lamjung, Syangja, and surrounding districts. The Dharan branch will serve the eastern Koshi Province, complementing the existing Jhapa and Purbanchal branches.\n\nEach new branch has an elected executive committee of seven members and will hold quarterly regional events, workshops, and student counselling sessions. The branches will also serve as local points of contact for ECAN's complaints and student support channels.\n\nWith ten active branches, ECAN now has a physical presence in all seven provinces of Nepal, fulfilling a key objective of the 2022–2026 strategic plan.",
    date: "2024-08-18",
    category: "announcement",
    image: himalaya,
    images: [ecanElection, presidentPicnic],
    layout: "magazine",
    author: "ECAN Secretariat",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "australia-student-visa-2025",
    title: "Australia Student Visa 2025: What's Changed and What to Expect",
    excerpt:
      "A complete breakdown of the latest changes to Australia's student visa (subclass 500) requirements, processing times, and GTE criteria.",
    content:
      "Australia remains one of the top destinations for Nepali students, but the visa landscape has shifted significantly in 2025. The Department of Home Affairs has tightened the Genuine Temporary Entrant (GTE) assessment, requiring more detailed documentation of financial capacity and study intentions.\n\nProcessing times have also increased to 6–8 weeks on average. This guide walks you through every step of the updated application process, from gathering financial evidence to writing a compelling GTE statement.\n\nKey changes include a new requirement for a detailed study plan explaining why you chose Australia over other destinations, and why your chosen institution and course align with your career goals. The financial threshold has also been raised — you now need to demonstrate access to at least AUD 21,041 for the first year.\n\nHealth insurance (OSHC) must now be purchased before lodging the visa application, not after. Make sure you obtain a policy from an approved provider and include the certificate in your application.\n\nDespite the tighter requirements, Australia remains one of the most accessible destinations for Nepali students with strong academic records and clear career goals. Work with an ECAN-registered consultancy to ensure your application is complete and compelling.",
    date: "2025-04-10",
    category: "visa",
    image: img1,
    images: [img2, img3],
    layout: "hero-image",
    author: "Priya Sharma",
    readTime: 8,
  },
  {
    id: "uk-scholarship-guide-2025",
    title: "Top 10 UK Scholarships for Nepali Students in 2025",
    excerpt:
      "From Chevening to university-specific awards — a curated list of scholarships that Nepali students can realistically apply for.",
    content:
      "The United Kingdom offers a wide range of scholarships for international students, and Nepali students are increasingly competitive applicants. This guide covers the Chevening Scholarship, Commonwealth Scholarships, and ten university-specific awards with strong track records of selecting Nepali candidates.\n\nChevening Scholarships are the UK government's flagship international awards programme. They are awarded to individuals with demonstrable leadership potential. The application window opens in August each year, and Nepali students have a strong success rate.\n\nThe Commonwealth Scholarship Commission offers several award types including Master's Scholarships, Split-site Scholarships, and Distance Learning Scholarships. These are particularly valuable for students who want to study in the UK but maintain ties to Nepal.\n\nUniversity-specific awards worth noting include the University of Edinburgh's Global Scholarships, the University of Manchester's Global Futures Scholarship, and the University of Bristol's Think Big Scholarships. Each has different eligibility criteria and application timelines.\n\nDeadlines, eligibility criteria, and application tips are included for each scholarship in the full guide available on the ECAN website. Start your applications at least six months before the deadline to allow time for reference letters and personal statements.",
    date: "2025-03-22",
    category: "scholarship",
    image: img4,
    images: [img6, img7],
    layout: "magazine",
    author: "Rajesh Adhikari",
    readTime: 10,
  },
  {
    id: "canada-pgwp-changes",
    title: "Canada's PGWP Changes: How They Affect Nepali Graduates",
    excerpt:
      "Canada has updated its Post-Graduation Work Permit rules. Here's what Nepali students need to know before choosing a programme.",
    content:
      "Canada's Post-Graduation Work Permit (PGWP) programme has undergone significant changes that directly affect Nepali students planning to study there. The new rules tie PGWP eligibility more closely to specific programmes and institutions.\n\nStudents enrolled in certain college programmes may no longer qualify for the full three-year permit. Specifically, programmes at private colleges that are not designated learning institutions (DLIs) with high graduation rates may only qualify for a one-year PGWP, regardless of programme length.\n\nUniversity programmes and programmes at public colleges generally still qualify for the full PGWP duration equal to the length of the study programme, up to a maximum of three years.\n\nThe changes also affect students in field-of-study requirements. From 2024, PGWP applicants must have studied in a field aligned with Canada's labour market needs. The government has published a list of eligible fields — check this list carefully before choosing your programme.\n\nThis article explains the changes and helps students make informed decisions. Consult an ECAN-registered consultancy before finalising your Canadian study plans.",
    date: "2025-02-14",
    category: "destination",
    image: img2,
    images: [img1, img4],
    layout: "split",
    author: "Sunita Karmacharya",
    readTime: 7,
  },
  {
    id: "ielts-preparation-tips",
    title: "IELTS 7.0+ in 60 Days: A Realistic Study Plan for Nepali Students",
    excerpt:
      "A structured, week-by-week preparation plan that has helped hundreds of Nepali students achieve their target IELTS band score.",
    content:
      "Achieving a band score of 7.0 or above in IELTS is a requirement for most top universities in the UK, Australia, and Canada. This guide provides a realistic 60-day study plan tailored to the strengths and common weaknesses of Nepali test-takers.\n\nWeeks 1–2: Diagnostic and Foundation. Take a full practice test under timed conditions to identify your weakest modules. Most Nepali students score lower in Writing and Speaking than in Reading and Listening. Focus your first two weeks on understanding the marking criteria for each module.\n\nWeeks 3–4: Reading and Listening. These modules reward speed and accuracy. Practice skimming and scanning techniques for Reading. For Listening, train yourself to write while listening — a skill that requires daily practice.\n\nWeeks 5–6: Writing. Task 1 (Academic) requires you to describe visual data objectively. Task 2 requires a structured essay. Learn the standard essay structures and practice writing at least one Task 2 essay per day. Get feedback from a qualified teacher.\n\nWeeks 7–8: Speaking. Record yourself answering Part 2 cue card questions and listen back critically. Focus on fluency, coherence, and vocabulary range. Practice with a partner or tutor at least three times per week.\n\nFinal two weeks: Full mock tests under exam conditions, review of weak areas, and mental preparation. Book your test at least three weeks before your university application deadline.",
    date: "2025-01-30",
    category: "tips",
    image: img3,
    images: [img6],
    layout: "classic",
    author: "Binod Adhikari",
    readTime: 12,
  },
  {
    id: "choosing-right-consultancy",
    title: "How to Choose the Right Education Consultancy in Nepal",
    excerpt:
      "Not all consultancies are equal. Here's a practical checklist to help students and parents identify trustworthy, ECAN-registered consultancies.",
    content:
      "With hundreds of education consultancies operating across Nepal, choosing the right one can be overwhelming. This guide provides a practical checklist of questions to ask, red flags to watch for, and the importance of verifying ECAN membership.\n\nA registered ECAN member is bound by a code of ethics and subject to regular audits, providing an important layer of protection for students. Always verify membership on the ECAN website before paying any fees.\n\nQuestions to ask: Is the consultancy registered with ECAN? Can they provide references from past students? What is their success rate for visa applications? Do they have direct partnerships with universities, or do they work through agents?\n\nRed flags to watch for: Guarantees of visa approval (no one can guarantee this), requests for large upfront payments before any services are rendered, pressure to apply to specific universities without explaining why they are suitable for you, and lack of transparency about fees.\n\nA good consultancy will take time to understand your academic background, career goals, and financial situation before recommending destinations and institutions. They will explain the full cost of studying abroad, including tuition, living expenses, and visa fees.",
    date: "2024-12-05",
    category: "guide",
    image: img6,
    images: [img7, img1],
    layout: "split",
    author: "ECAN Editorial",
    readTime: 6,
  },
  {
    id: "germany-free-education",
    title: "Studying in Germany for Free: A Guide for Nepali Students",
    excerpt:
      "Germany's public universities charge minimal or no tuition fees. Here's everything a Nepali student needs to know to make it happen.",
    content:
      "Germany has emerged as one of the most attractive destinations for Nepali students seeking quality education at minimal cost. Most public universities charge only a semester fee of €150–€350, covering administrative costs and public transport.\n\nLanguage requirements vary by programme. Many Master's programmes are offered in English, but Bachelor's programmes are predominantly in German. If you plan to study in German, you will need a TestDaF or DSH certificate at level B2 or above.\n\nApplication timelines are strict. The winter semester (October start) has a deadline of 15 July for most universities. The summer semester (April start) has a deadline of 15 January. Apply through uni-assist, the central application portal for international students.\n\nThe student visa for Germany requires a blocked account (Sperrkonto) with €11,208 deposited before the visa appointment. This money is released in monthly instalments of €934 once you arrive in Germany.\n\nThe best cities for Nepali students include Munich, Berlin, Hamburg, and Stuttgart. Each has a growing Nepali community and strong job prospects after graduation. Germany's post-study work visa allows graduates to stay for 18 months to find employment.",
    date: "2024-11-12",
    category: "destination",
    image: img7,
    images: [img2, img3, img4],
    layout: "magazine",
    author: "Kamala Poudel",
    readTime: 9,
  },
  {
    id: "career-after-abroad-study",
    title: "Coming Back Home: Building a Career in Nepal After Studying Abroad",
    excerpt:
      "Returning graduates share their experiences navigating Nepal's job market with an international degree — and how to make it work.",
    content:
      "An increasing number of Nepali graduates are choosing to return home after completing their studies abroad. This article explores the opportunities and challenges they face, featuring insights from graduates who have successfully built careers in Nepal's growing tech, finance, and education sectors.\n\nThe perception that an international degree guarantees a high salary in Nepal is changing. Employers increasingly value practical skills and local market knowledge alongside academic credentials. Returning graduates who succeed are those who combine their international education with a deep understanding of Nepal's context.\n\nGrowth sectors for returning graduates include fintech and digital payments, agritech, tourism technology, education technology, and renewable energy. Nepal's startup ecosystem is nascent but growing, and international graduates with technical skills are in demand.\n\nNetworking is critical. Join ECAN's alumni network, attend industry events, and connect with the diaspora community. Many returning graduates find their first opportunities through personal connections rather than formal job applications.\n\nConsider the option of working remotely for international companies while based in Nepal. This allows you to earn in foreign currency while building local connections and waiting for the right local opportunity.",
    date: "2024-09-20",
    category: "career",
    image: img4,
    images: [img6, img7],
    layout: "hero-image",
    author: "Dipak Joshi",
    readTime: 8,
  },
  {
    id: "japan-student-life",
    title: "Student Life in Japan: What Nepali Students Should Know",
    excerpt:
      "From language barriers to part-time work rules — an honest look at what life is really like for Nepali students in Japan.",
    content:
      "Japan is an increasingly popular destination for Nepali students, particularly for engineering and technology programmes. However, the cultural and linguistic adjustment can be significant.\n\nThe Japanese language requirement is the biggest barrier for most Nepali students. Even if your programme is in English, daily life in Japan requires at least basic Japanese. Most universities offer Japanese language courses, and many students take intensive language classes before arriving.\n\nPart-time work is permitted for student visa holders, but strictly limited to 28 hours per week during term time and 40 hours per week during holidays. Exceeding this limit can result in visa cancellation. Common part-time jobs for Nepali students include restaurant work, convenience store staff, and factory work.\n\nCost of living varies significantly by city. Tokyo is the most expensive, with monthly living costs of ¥120,000–¥150,000 including rent, food, and transport. Osaka and Nagoya are more affordable at ¥90,000–¥120,000 per month.\n\nThe Nepali student community in Japan is vibrant and supportive. There are active Nepali student associations at most major universities, and regular cultural events throughout the year. Many Nepali students find the community to be an important source of support during the adjustment period.",
    date: "2024-07-08",
    category: "destination",
    image: img1,
    images: [img2, img3, img6],
    layout: "magazine",
    author: "Hari Lamsal",
    readTime: 11,
  },
];

export const NEWS_CATEGORIES = [
  { value: "all", label: "All News" },
  { value: "announcement", label: "Announcements" },
  { value: "policy", label: "Policy" },
  { value: "event", label: "Events" },
  { value: "partnership", label: "Partnerships" },
  { value: "award", label: "Awards" },
] as const;

export const BLOG_CATEGORIES = [
  { value: "all", label: "All Posts" },
  { value: "guide", label: "Guides" },
  { value: "destination", label: "Destinations" },
  { value: "visa", label: "Visa" },
  { value: "scholarship", label: "Scholarships" },
  { value: "career", label: "Career" },
  { value: "tips", label: "Tips" },
] as const;

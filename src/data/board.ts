export interface BoardMember {
  name: string;
  role: string;
  /** Optional photo — place the file in src/assets/past-board/ and import it here */
  image?: string;
}

export interface PastBoard {
  term: string;
  president: string;
  members: BoardMember[];
}

export const pastBoards: PastBoard[] = [
  {
    term: "2022–2024",
    president: "Seshraj Bhattarai",
    members: [
      { name: "Seshraj Bhattarai", role: "President" },
      { name: "Laxman Poudel (Andrew)", role: "1st Vice President" },
      { name: "Bashu Deb Dahal", role: "2nd Vice President" },
      { name: "Bikalp Raj Pokhrel", role: "General Secretary" },
      { name: "Bhaba Nath Humagai", role: "1st Secretary" },
      { name: "Suraj Silwal", role: "2nd Secretary" },
      { name: "Sadhana Pudasaini", role: "Treasurer" },
      { name: "Govinda Khanal", role: "Joint Treasurer" },
    ],
  },
  {
    term: "2020–2022",
    president: "Rajesh Shrestha",
    members: [
      { name: "Rajesh Shrestha", role: "President" },
      { name: "Seshraj Bhattarai", role: "1st Vice President" },
      { name: "Narayan Prasad Ghimire", role: "2nd Vice President" },
      { name: "Dipak Raj Joshi", role: "General Secretary" },
      { name: "Ramesh Kumar Thapa", role: "1st Secretary" },
      { name: "Sunita Karmacharya", role: "2nd Secretary" },
      { name: "Binod Prasad Adhikari", role: "Treasurer" },
      { name: "Prabha Devi Shrestha", role: "Joint Treasurer" },
    ],
  },
  {
    term: "2018–2020",
    president: "Narayan Prasad Ghimire",
    members: [
      { name: "Narayan Prasad Ghimire", role: "President" },
      { name: "Rajesh Shrestha", role: "1st Vice President" },
      { name: "Hari Prasad Lamsal", role: "2nd Vice President" },
      { name: "Dipak Raj Joshi", role: "General Secretary" },
      { name: "Binod Prasad Adhikari", role: "1st Secretary" },
      { name: "Kamala Devi Poudel", role: "2nd Secretary" },
      { name: "Ramesh Kumar Thapa", role: "Treasurer" },
      { name: "Sunita Karmacharya", role: "Joint Treasurer" },
    ],
  },
  {
    term: "2016–2018",
    president: "Hari Prasad Lamsal",
    members: [
      { name: "Hari Prasad Lamsal", role: "President" },
      { name: "Narayan Prasad Ghimire", role: "1st Vice President" },
      { name: "Mohan Bahadur Thapa", role: "2nd Vice President" },
      { name: "Rajesh Shrestha", role: "General Secretary" },
      { name: "Kamala Devi Poudel", role: "1st Secretary" },
      { name: "Dipak Raj Joshi", role: "2nd Secretary" },
      { name: "Sunita Karmacharya", role: "Treasurer" },
      { name: "Binod Prasad Adhikari", role: "Joint Treasurer" },
    ],
  },
  {
    term: "2014–2016",
    president: "Mohan Bahadur Thapa",
    members: [
      { name: "Mohan Bahadur Thapa", role: "President" },
      { name: "Hari Prasad Lamsal", role: "1st Vice President" },
      { name: "Shyam Prasad Acharya", role: "2nd Vice President" },
      { name: "Narayan Prasad Ghimire", role: "General Secretary" },
      { name: "Rajesh Shrestha", role: "1st Secretary" },
      { name: "Kamala Devi Poudel", role: "2nd Secretary" },
      { name: "Dipak Raj Joshi", role: "Treasurer" },
      { name: "Ramesh Kumar Thapa", role: "Joint Treasurer" },
    ],
  },
  {
    term: "2012–2014",
    president: "Shyam Prasad Acharya",
    members: [
      { name: "Shyam Prasad Acharya", role: "President" },
      { name: "Mohan Bahadur Thapa", role: "1st Vice President" },
      { name: "Krishna Prasad Dhakal", role: "2nd Vice President" },
      { name: "Hari Prasad Lamsal", role: "General Secretary" },
      { name: "Narayan Prasad Ghimire", role: "1st Secretary" },
      { name: "Rajesh Shrestha", role: "2nd Secretary" },
      { name: "Kamala Devi Poudel", role: "Treasurer" },
      { name: "Dipak Raj Joshi", role: "Joint Treasurer" },
    ],
  },
];

export const board: BoardMember[] = [
  { name: "Laxman Poudel (Andrew)", role: "President" },
  { name: "Seshraj Bhattarai", role: "Immediate Past President" },
  { name: "Bashu Deb Dahal", role: "1st Vice President" },
  { name: "Bikalp Raj Pokhrel", role: "2nd Vice President" },
  { name: "Geeta Siwakoti", role: "3rd Vice President" },
  { name: "Bhaba Nath Humagai", role: "General Secretary" },
  { name: "Suraj Silwal", role: "1st Secretary" },
  { name: "Ashik Karki", role: "2nd Secretary" },
  { name: "Sadhana Pudasaini", role: "Treasurer" },
  { name: "Govinda Khanal", role: "Joint Treasurer" },
];

export const events = [
  {
    title: "27th ECAN Annual Day",
    when: "6:00 PM onwards",
    where: "Hotel Everest, New Baneshwor, Kathmandu",
    blurb: "A celebration of twenty-seven years guiding Nepali students into the world.",
    tag: "Annual",
  },
  {
    title: "16th Annual Picnic",
    when: "10:00 AM – 5:30 PM",
    where: "Dusit Thani Himalayan Resort",
    blurb: "Professionalism unplugged — where memories are made.",
    tag: "Community",
  },
  {
    title: "EduClave 2.0 — Policy Dialogue",
    when: "10:00 AM onwards",
    where: "Marriott Hotel, Naxal, Kathmandu",
    blurb: "A national dialogue on shaping Nepal's outbound education policy.",
    tag: "Policy",
  },
];

export const services = [
  {
    title: "Verified Excellence",
    body: "Access Nepal's only vetted network of certified educational consultancies — every member held to ECAN's uncompromising code of ethics.",
    href: "/members" as const,
    icon: "badge-check",
  },
  {
    title: "Industry Pulse",
    body: "Stay ahead with global summits, policy dialogues, and professional workshops that define the future of outbound education.",
    href: "/events" as const,
    icon: "globe",
  },
  {
    title: "Knowledge Hub",
    body: "Master your practice with exclusive country briefs, counsellor handbooks, and research that keeps you at the cutting edge.",
    href: "/about" as const,
    icon: "library",
  },
  {
    title: "Seamless Testing",
    body: "Secure your future with our streamlined, member-trusted IELTS portal — built for speed, reliability, and student confidence.",
    href: "/contact" as const,
    icon: "pen-line",
  },
];

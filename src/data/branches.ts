const BASE = "https://ecan.org.np/media/uploads/board-member/";

export interface BranchMember {
  name: string;
  role: string;
  photo: string | null;
}

export interface Branch {
  slug: string;
  name: string;
  province: string;
  color: string;
  accent: string;
  contact: string;
  members: BranchMember[];
}

export const branches: Branch[] = [
  {
    slug: "chitwan",
    name: "Chitwan",
    province: "Bagmati Province",
    color: "from-emerald-700 to-emerald-900",
    accent: "bg-emerald-500",
    contact: "056-493374",
    members: [
      { name: "Bhoj Bahadur Khadka", role: "President", photo: `${BASE}1.Bhoj_l7CWXMv.jpeg` },
      { name: "Suraj Silwal", role: "1st Secretary", photo: null },
      { name: "Sadhana Pudasaini", role: "Treasurer", photo: null },
    ],
  },
  {
    slug: "kaski",
    name: "Kaski",
    province: "Gandaki Province",
    color: "from-blue-700 to-blue-900",
    accent: "bg-blue-500",
    contact: "Pokhara",
    members: [
      { name: "Milan Tiwari", role: "President", photo: null },
      { name: "Rudra Prasad Aryal", role: "Secretary", photo: null },
      { name: "Bhupal Thapa", role: "Treasurer", photo: null },
    ],
  },
  {
    slug: "lalitpur",
    name: "Lalitpur",
    province: "Bagmati Province",
    color: "from-violet-700 to-violet-900",
    accent: "bg-violet-500",
    contact: "Kumaripati",
    members: [
      {
        name: "Sanam Kumar Maharjan",
        role: "President",
        photo: `${BASE}3._Sanam_Kumar_Maharjan_-_Secretary_qnYRz51.jpg`,
      },
      { name: "Mukunda Bajagai", role: "Vice President", photo: null },
      { name: "Arbind Kumar Singh", role: "Immediate Past President", photo: null },
    ],
  },
  {
    slug: "purbanchal",
    name: "Purbanchal",
    province: "Koshi Province",
    color: "from-orange-700 to-orange-900",
    accent: "bg-orange-500",
    contact: "Itahari",
    members: [
      {
        name: "Ravi Kumar Gupta",
        role: "President",
        photo: `${BASE}WhatsApp_Image_2025-12-14_at_16.50.15_NCO7QGs.jpeg`,
      },
      { name: "Durlav Karki", role: "Secretary", photo: null },
      { name: "Gopal Niraula", role: "Treasurer", photo: null },
    ],
  },
  {
    slug: "rupandehi",
    name: "Rupandehi",
    province: "Lumbini Province",
    color: "from-rose-700 to-rose-900",
    accent: "bg-rose-500",
    contact: "Butwal",
    members: [
      {
        name: "Om Prakash Gaihre",
        role: "President",
        photo: `${BASE}1._Om_Prakash_Gaihre_-_President.jpg`,
      },
      { name: "Ramesh K.C.", role: "Secretary", photo: null },
      { name: "Ram Chandra Tolange", role: "Treasurer", photo: null },
    ],
  },
  {
    slug: "jhapa",
    name: "Jhapa",
    province: "Koshi Province",
    color: "from-teal-700 to-teal-900",
    accent: "bg-teal-500",
    contact: "Birtamod",
    members: [
      {
        name: "Raj Kumar Karki",
        role: "President",
        photo: `${BASE}1_Raj_Kumar_Karki_-President_cGTO0nW.jpg`,
      },
      { name: "Roshan Subedi", role: "Immediate Past President", photo: null },
      { name: "Ashok Bhandari", role: "Executive Member", photo: null },
    ],
  },
  {
    slug: "makwanpur",
    name: "Makwanpur",
    province: "Bagmati Province",
    color: "from-amber-700 to-amber-900",
    accent: "bg-amber-500",
    contact: "Hetauda",
    members: [
      {
        name: "Bel Prasad Khatiwada",
        role: "President",
        photo: `${BASE}1_Bel_Prasad_Khatiwada_President.jpg`,
      },
      { name: "Manish Adhikari", role: "Secretary", photo: null },
      { name: "Kishor Aryal", role: "Treasurer", photo: null },
    ],
  },
  {
    slug: "kavre",
    name: "Kavre",
    province: "Bagmati Province",
    color: "from-cyan-700 to-cyan-900",
    accent: "bg-cyan-500",
    contact: "Banepa",
    members: [
      {
        name: "Bhuwan Rayamajhi",
        role: "President",
        photo: `${BASE}01_Bhuwan_Rayamajhi_-_President.jpg`,
      },
      { name: "Bal Krishna Neupane", role: "Secretary", photo: null },
      { name: "Sharmila Timalsina", role: "Vice President", photo: null },
    ],
  },
];

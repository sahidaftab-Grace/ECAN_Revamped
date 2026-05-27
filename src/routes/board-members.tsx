import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Crown as CrownIcon,
  History,
  Mail,
  Phone,
  Globe,
  Quote,
  ChevronRight,
  Users,
  Shield,
  Star,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

// ── Officer photos ────────────────────────────────────────────────────────────
import president from "@/assets/1_-_President_-_Laxman_Andrew_Poudel.jpeg";
import pastPres from "@/assets/2_-_Seshraj_Bhattarai.png";
import vp1 from "@/assets/3_-_Vice_President_-_Bashudeb_Dahal.jpeg";
import vp2 from "@/assets/4_-_Vice_President_-_Bikalp_Raj_Pokhrel_-_07.jpeg";
import vp3 from "@/assets/5._Geeta_Siwakoti.png";
import genSec from "@/assets/6_-_General_Secretary_-_Bhaba_Nath_Humagai_-.jpeg";
import sec1 from "@/assets/7_-_Secretary_-_SUraj_Silwal.jpeg";
import sec2 from "@/assets/08_-_Secretary_-_Ashik_Karki_-_01.jpeg";
import treas from "@/assets/9_-_Treasurer_-_Sadhana_Pudasaini_-_02.jpeg";
import jTreas from "@/assets/10_-_Joint_Treasurer_-_Govinda_Khanal_-_01.jpeg";

// ── Executive member photos ───────────────────────────────────────────────────
import mem11 from "@/assets/11_Member_-_Ananta_Raj_Ghimire_-_01.jpeg";
import mem12 from "@/assets/12_Member_-_Uddhab_Ban_-_03.jpeg";
import mem13 from "@/assets/13_Member_-_Vibek_Basnet_-_11.jpeg";
import mem14 from "@/assets/14_Member_-_Damodar_Sharma_-_05.jpeg";
import mem15 from "@/assets/15_Member_-_Ashok_Kumar_Hathi_-_02.jpeg";
import mem16 from "@/assets/16_Member_-_Dinesh_Poudel_-_06.jpeg";
import mem17 from "@/assets/17_Member_-_Sanjib_Pandey_-_14.jpeg";
import mem18 from "@/assets/18_Member_-_Shiva_Prasad_Aryal_-_13.jpeg";
import mem19 from "@/assets/19_Member_-_Kamal_Prasad_Timalsina_-_04.jpeg";
import mem20 from "@/assets/20.jpeg";
import mem21 from "@/assets/21.jpeg";

// ── Member by post ────────────────────────────────────────────────────────────
import bhoj from "@/assets/1.Bhoj_l7CWXMv.jpeg";
import omPrakash from "@/assets/1._Om_Prakash_Gaihre_-_President.jpg";
import sanam from "@/assets/3._Sanam_Kumar_Maharjan_-_Secretary_qnYRz51.jpg";
import raviGupta from "@/assets/WhatsApp_Image_2025-12-14_at_16.50.15_NCO7QGs.jpeg";
import govindaB from "@/assets/1._612-_Govinda_Basnet_QW04wyh.jpg";
import rajKarki from "@/assets/1_Raj_Kumar_Karki_-President_cGTO0nW.jpg";
import belPrasad from "@/assets/1_Bel_Prasad_Khatiwada_President.jpg";
import bhuwan from "@/assets/01_Bhuwan_Rayamajhi_-_President.jpg";

// ── Advisory board photos ─────────────────────────────────────────────────────
import arunL from "@/assets/arun_hj1llh8.jpg";
import maheshK from "@/assets/4.mahesh_KFaVaPg.jpg";
import sarojB from "@/assets/7.saroj_Fr5tDkU.jpg";
import rajuD from "@/assets/2.raju_yS9vGS9.jpg";
import thirlalB from "@/assets/13.thirlal_KAspLeP.jpg";
import devidash from "@/assets/06-_Devidash_Bhattarai_2.jpeg";
import prakashS from "@/assets/07-_Prakash_Shrestha.jpg";
import yasoda from "@/assets/5.yasoda_sqBf53M.jpg";
import nirupama from "@/assets/12.nirupama_lDxnZkW.jpg";
import rajaniS from "@/assets/10_-_Rajani_Shrestha.jpg";
import sapanaR from "@/assets/11_-_Sapana_Rajbhandari.jpg";
import maheshBh from "@/assets/12_-_Mahesh_Bhandari.jpg";
import upendraD from "@/assets/13_Upendra_Dev_Dhakal.jpg";
import dayaRam from "@/assets/14_-_Daya_Ram_Thapa.jpeg";
import koshrajG from "@/assets/15_-_Koshraj_Giri.jpeg";

// ── Past Presidential Council ─────────────────────────────────────────────────
import deepakG from "@/assets/3.Mr._Deepak_Gurung_Member_Past_Presidential_Council_ECAN__AxPw30D.jpg";
import rajendraB from "@/assets/1.Mr._Rajendra_Baral_-_Chairperson_Past_Presidential_Council_ECAN_SJi4oli.jpg";
import arunLPPC from "@/assets/Mr._Arun_Lamichhane_-_Member__Past_Presidential_Council_ECAN_dSiMJaP.jpg";
import buddhiR from "@/assets/4.Mr._Buddhi_Prasad_Regmi-_Member_Past_Presidential_Council_ECAN__.jpeg";
import prakashP from "@/assets/Prakash_Pandey_hOvWsbh.jpg";
import bishnuP from "@/assets/Bishnu_Hari_Pandey.jpeg";

export const Route = createFileRoute("/board-members")({
  component: BoardMembersPage,
  head: () => ({
    meta: [
      { title: "Board Members — ECAN" },
      {
        name: "description",
        content:
          "Meet the elected executive board, advisory board and past presidential council of ECAN.",
      },
    ],
  }),
});

// ── Data ──────────────────────────────────────────────────────────────────────
const officers = [
  {
    name: "Laxman Poudel (Andrew)",
    role: "President",
    photo: president,
    email: "president@ecan.org.np",
    phone: "+977-1-4521487",
    isPresident: true,
    bio: "Laxman Poudel (Andrew) is a seasoned education consultant with over two decades of experience guiding Nepali students into international higher education. As President, he leads the Smart 2.0 initiative — a landmark framework for ethical consultancy, student security, and institutional accountability.",
    quote:
      "Sending a child abroad is a leap of faith. My mission is to turn that leap into a confident step.",
  },
  {
    name: "Seshraj Bhattarai",
    role: "Immediate Past President",
    photo: pastPres,
    email: null,
    phone: null,
    isPresident: false,
    bio: "Seshraj Bhattarai served as ECAN President during 2022–2024, overseeing significant growth in membership and the launch of ECAN's digital infrastructure. His tenure strengthened relationships with international education partners.",
    quote: "The foundation we built together will carry ECAN forward for generations.",
  },
  {
    name: "Bashu Deb Dahal",
    role: "1st Vice President",
    photo: vp1,
    email: null,
    phone: null,
    isPresident: false,
    bio: "Bashu Deb Dahal brings extensive experience in student counselling and institutional partnerships. He oversees ECAN's member relations and professional development programmes.",
    quote: "Professional excellence is not a destination — it is a daily commitment.",
  },
  {
    name: "Bikalp Raj Pokhrel",
    role: "2nd Vice President",
    photo: vp2,
    email: null,
    phone: null,
    isPresident: false,
    bio: "Bikalp Raj Pokhrel is responsible for ECAN's policy advocacy and government relations. He has been instrumental in shaping Nepal's outbound education policy framework.",
    quote: "Policy shapes the environment in which students dream. We must shape it wisely.",
  },
  {
    name: "Geeta Siwakoti",
    role: "3rd Vice President",
    photo: vp3,
    email: null,
    phone: null,
    isPresident: false,
    bio: "Geeta Siwakoti leads ECAN's gender equity and student welfare initiatives. She has championed programmes to support female students and first-generation international students.",
    quote: "Every student deserves equal access to the world's opportunities.",
  },
  {
    name: "Bhaba Nath Humagai",
    role: "General Secretary",
    photo: genSec,
    email: "secretary@ecan.org.np",
    phone: "+977-1-4522267",
    isPresident: false,
    bio: "Bhaba Nath Humagai manages ECAN's day-to-day operations and strategic communications. He coordinates between the executive board, member consultancies, and external partners.",
    quote: "Good governance is the backbone of every trusted institution.",
  },
  {
    name: "Suraj Silwal",
    role: "1st Secretary",
    photo: sec1,
    email: null,
    phone: null,
    isPresident: false,
    bio: "Suraj Silwal supports ECAN's secretariat functions and manages the association's event calendar and member communications, including the Annual Day and EduClave.",
    quote: "Every great event begins with meticulous preparation.",
  },
  {
    name: "Ashik Karki",
    role: "2nd Secretary",
    photo: sec2,
    email: null,
    phone: null,
    isPresident: false,
    bio: "Ashik Karki manages ECAN's digital communications, social media presence, and member directory. He has been central to ECAN's digital transformation including the Smart 2.0 portal.",
    quote: "Digital tools amplify our reach — but trust is still built person to person.",
  },
  {
    name: "Sadhana Pudasaini",
    role: "Treasurer",
    photo: treas,
    email: null,
    phone: null,
    isPresident: false,
    bio: "Sadhana Pudasaini oversees ECAN's financial management, budgeting, and audit processes. Her rigorous approach to financial governance has strengthened ECAN's institutional credibility.",
    quote: "Financial integrity is the foundation of institutional trust.",
  },
  {
    name: "Govinda Khanal",
    role: "Joint Treasurer",
    photo: jTreas,
    email: null,
    phone: null,
    isPresident: false,
    bio: "Govinda Khanal supports ECAN's financial operations and manages the scholarship fund and member fee collections, ensuring accurate financial reporting and compliance.",
    quote: "Every rupee managed well is a step toward a stronger association.",
  },
];

const execMembers = [
  { name: "Ananta Raj Ghimire", role: "Executive Member", photo: mem11 },
  { name: "Uddab Ban", role: "Executive Member", photo: mem12 },
  { name: "Vivek Basnet", role: "Executive Member", photo: mem13 },
  { name: "Damodar Sharma", role: "Executive Member", photo: mem14 },
  { name: "Ashok Kumar Hathi", role: "Executive Member", photo: mem15 },
  { name: "Dinesh Paudel", role: "Executive Member", photo: mem16 },
  { name: "Sanjeev Pandey", role: "Executive Member", photo: mem17 },
  { name: "Shiva Prasad Aryal", role: "Executive Member", photo: mem18 },
  { name: "Kamal Prasad Timalsina", role: "Executive Member", photo: mem19 },
  { name: "Pradip Bhusal", role: "Executive Member", photo: mem20 },
  { name: "Sudip KC", role: "Executive Member", photo: mem21 },
  { name: "Ravi Kumar Gupta", role: "Executive Member", photo: raviGupta },
  { name: "Govinda Basnet", role: "Executive Member", photo: govindaB },
  { name: "Raj Kumar Karki", role: "Executive Member", photo: rajKarki },
  { name: "Bel Prasad Khatiwada", role: "Executive Member", photo: belPrasad },
  { name: "Bhuwan Rayamajhi", role: "Executive Member", photo: bhuwan },
  { name: "Bhoj Bahadur Khadka", role: "Member by Post", photo: bhoj },
  { name: "Om Prakash Gaihre", role: "Member by Post", photo: omPrakash },
  { name: "Sanam Kumar Maharjan", role: "Member by Post", photo: sanam },
];

const advisoryMembers = [
  { name: "Mr. Arun Lamichhane", role: "Chairperson — ECAN Advisory Committee", photo: arunL },
  { name: "Mr. Mahesh Kumar Karki", role: "Member — ECAN Advisory Committee", photo: maheshK },
  { name: "Mr. Saroj Kumar Basnet", role: "Member — ECAN Advisory Committee", photo: sarojB },
  { name: "Mr. Raju Prasad Dallakoti", role: "Member — ECAN Advisory Committee", photo: rajuD },
  { name: "Mr. Thirlal Bhatta", role: "Member — ECAN Advisory Committee", photo: thirlalB },
  { name: "Mr. Devi Das Bhattarai", role: "Member — ECAN Advisory Committee", photo: devidash },
  { name: "Mr. Prakash Shrestha", role: "Member — ECAN Advisory Committee", photo: prakashS },
  { name: "Ms. Yasoda Bhattarai", role: "Member — ECAN Advisory Committee", photo: yasoda },
  { name: "Ms. Nirupama Maharjan", role: "Member — ECAN Advisory Committee", photo: nirupama },
  { name: "Ms. Rajani Shrestha", role: "Member — ECAN Advisory Committee", photo: rajaniS },
  { name: "Ms. Sapana Rajbhandari", role: "Member — ECAN Advisory Committee", photo: sapanaR },
  { name: "Mr. Mahesh Bhandari", role: "Member — ECAN Advisory Committee", photo: maheshBh },
  { name: "Mr. Upendra Dev Dhakal", role: "Member — ECAN Advisory Committee", photo: upendraD },
  { name: "Mr. Daya Ram Thapa", role: "Member — ECAN Advisory Committee", photo: dayaRam },
  { name: "Mr. Koshraj Giri", role: "Member — ECAN Advisory Committee", photo: koshrajG },
];

const pastPresidentialCouncil = [
  { name: "Deepak Gurung", role: "Chairperson — ECAN Past Presidential Council", photo: deepakG },
  { name: "Rajendra Baral", role: "Member — ECAN Past Presidential Council", photo: rajendraB },
  { name: "Arun Lamichhane", role: "Member — ECAN Past Presidential Council", photo: arunLPPC },
  { name: "Buddhi Prasad Regmi", role: "Member — ECAN Past Presidential Council", photo: buddhiR },
  { name: "Prakash Pandey", role: "Member — ECAN Past Presidential Council", photo: prakashP },
  { name: "Bishnu Hari Pandey", role: "Member — ECAN Past Presidential Council", photo: bishnuP },
];

// ── Animation ─────────────────────────────────────────────────────────────────
const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const cardItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ── Section divider ───────────────────────────────────────────────────────────
function SectionDivider({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-4 my-12">
      <div className="h-px flex-1 bg-[var(--border)]" />
      <p className="text-label text-[var(--slate)] flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <div className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}

// ── President featured card ───────────────────────────────────────────────────
function PresidentCard({ m }: { m: (typeof officers)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-4 rounded-3xl overflow-hidden border-2 border-[var(--navy)] shadow-2xl bg-[var(--navy)] text-white"
    >
      <div className="grid lg:grid-cols-5">
        <div className="lg:col-span-2 relative min-h-[380px] lg:min-h-0 overflow-hidden">
          <img
            src={m.photo}
            alt={m.name}
            className="absolute inset-0 w-full h-full object-cover object-[80%_10%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[var(--navy)]/30" />
        </div>
        <div className="lg:col-span-3 flex flex-col justify-between p-8 md:p-12">
          <div>
            <span className="inline-flex items-center gap-2 text-[var(--gold)] text-label mb-5">
              <CrownIcon className="h-4 w-4" /> President · ECAN 2024–2026
            </span>
            <h2 className="text-heading text-white">
              {m.name}
            </h2>
            <p className="mt-5 text-white/65 text-body max-w-xl">{m.bio}</p>
          </div>
          <div className="mt-8 border-l-2 border-[var(--gold)]/50 pl-5">
            <Quote className="h-5 w-5 text-[var(--gold)]/60 mb-2" />
            <p className="text-white/80 italic text-body-sm">{m.quote}</p>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-5">
            {m.email && (
              <a
                href={`mailto:${m.email}`}
                className="flex items-center gap-2 text-caption text-white/50 hover:text-[var(--gold)] transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> {m.email}
              </a>
            )}
            {m.phone && (
              <a
                href={`tel:${m.phone}`}
                className="flex items-center gap-2 text-caption text-white/50 hover:text-[var(--gold)] transition-colors"
              >
                <Phone className="h-3.5 w-3.5" /> {m.phone}
              </a>
            )}
            <a
              href="https://ecan.org.np"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-caption text-white/50 hover:text-[var(--gold)] transition-colors"
            >
              <Globe className="h-3.5 w-3.5" /> ecan.org.np
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Officer card (bio + quote) ────────────────────────────────────────────────
function OfficerCard({ m }: { m: (typeof officers)[0] }) {
  return (
    <motion.div
      variants={cardItem}
      className="group bg-white rounded-2xl border-2 border-[var(--border)] overflow-hidden hover:border-[var(--navy)] hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]">
        <img
          src={m.photo}
          alt={m.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-label">{m.role}</p>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-title text-[var(--navy)] line-clamp-1">
          {m.name}
        </p>
        <p className="mt-1 text-label text-[var(--crimson)] truncate">
          {m.role}
        </p>
        <p className="mt-3 text-body-sm text-[var(--slate)] line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
          {m.bio}
        </p>
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <p className="text-caption text-[var(--slate)] italic line-clamp-2">
            "{m.quote}"
          </p>
        </div>
        {m.email && (
          <a
            href={`mailto:${m.email}`}
            className="mt-4 inline-flex items-center gap-1.5 text-label text-[var(--slate)] hover:text-[var(--crimson)] transition-colors"
          >
            <Mail className="h-3 w-3" /> {m.email}
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── Simple photo card (exec members, advisory, PPC) ───────────────────────────
function PhotoCard({ m }: { m: { name: string; role: string; photo: string } }) {
  return (
    <motion.div
      variants={cardItem}
      className="group bg-white rounded-2xl border-2 border-[var(--border)] overflow-hidden hover:border-[var(--navy)] hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]">
        <img
          src={m.photo}
          alt={m.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/70 via-[var(--navy)]/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-white text-body font-semibold line-clamp-1">
            {m.name}
          </p>
          <p className="text-white/60 text-label mt-0.5 truncate">
            {m.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function BoardMembersPage() {
  const [boardItems, setBoardItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/board")
      .then((res) => res.json())
      .then((data) => {
        setBoardItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch board members:", err);
        setBoardItems([]);
        setLoading(false);
      });
  }, []);

  const officersList = boardItems.filter((b) => b.category === "officer");
  const execList = boardItems.filter((b) => b.category === "executive");
  const advisoryList = boardItems.filter((b) => b.category === "advisory");
  const ppcList = boardItems.filter((b) => b.category === "past-presidential");

  const presidentOfficer = officersList.find((b) => b.role === "President");
  const restOfficers = officersList.filter((b) => b.role !== "President");

  return (
    <>
      <PageHeader
        eyebrow="Executive Board 2024–2026"
        title={
          <>
            Current Board <span className="text-[var(--gold)]">Members</span>
          </>
        }
        intro="The elected leaders steering ECAN's mission to guide Nepal's students into international higher education."
      />

      <section className="container-page py-14 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-[var(--slate)]">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-sm">Loading board members…</span>
          </div>
        ) : (
          <>
            {/* ── President ── */}
            {presidentOfficer && (
              <PresidentCard
                m={{ ...presidentOfficer, photo: presidentOfficer.image_url || president }}
              />
            )}

            {/* ── Officers ── */}
            {restOfficers.length > 0 && (
              <>
                <SectionDivider label="Executive Officers" icon={CrownIcon} />
                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {restOfficers.map((m) => (
                    <OfficerCard key={m.id} m={{ ...m, photo: m.image_url || vp1 }} />
                  ))}
                </motion.div>
              </>
            )}

            {/* ── Executive Members ── */}
            {execList.length > 0 && (
              <>
                <SectionDivider label="Executive Members" icon={Users} />
                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                  {execList.map((m) => (
                    <PhotoCard key={m.id} m={{ ...m, photo: m.image_url || mem11 }} />
                  ))}
                </motion.div>
              </>
            )}

            {/* ── Advisory Board ── */}
            {advisoryList.length > 0 && (
              <>
                <SectionDivider label="Advisory Board Members" icon={Shield} />
                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {advisoryList.map((m) => (
                    <PhotoCard key={m.id} m={{ ...m, photo: m.image_url || arunL }} />
                  ))}
                </motion.div>
              </>
            )}

            {/* ── Past Presidential Council ── */}
            {ppcList.length > 0 && (
              <>
                <SectionDivider label="Past Presidential Council" icon={Star} />
                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                >
                  {ppcList.map((m) => (
                    <PhotoCard key={m.id} m={{ ...m, photo: m.image_url || deepakG }} />
                  ))}
                </motion.div>
              </>
            )}
          </>
        )}

        {/* ── Bottom CTA ── */}
        <div className="mt-16 rounded-2xl bg-[var(--navy)] text-white p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--crimson)]/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[var(--gold)]/10 blur-3xl pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="eyebrow text-[var(--gold)]">Elected by the Membership</p>
              <h2 className="mt-3 text-subheading text-white">
                Accountable to Nepal's Students
              </h2>
              <p className="mt-4 text-white/60 text-body-sm">
                Every member of the ECAN executive board is elected by the membership and serves a
                two-year term. Their mandate is to uphold ECAN's code of ethics and advance the
                interests of Nepal's students and member consultancies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
              <Link
                to="/past-board-members"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
              >
                <History className="h-4 w-4" /> Past Board Members
              </Link>
              <Link
                to="/branch-board"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--crimson)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--crimson)]/90 transition-all shadow-lg"
              >
                Branch Executives <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
  Quote,
  Sparkles,
  Globe2,
  ShieldCheck,
  Star,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Zap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import himalaya from "@/assets/himalaya-mist.jpg";
import appMockup from "@/assets/app.svg";
// Gallery images
import gallery1 from "@/assets/1.jpeg";
import gallery2 from "@/assets/2.jpeg";
import gallery3 from "@/assets/3.jpg";
import gallery4 from "@/assets/4.jpg";
import gallery6 from "@/assets/6.jpg";
import gallery7 from "@/assets/7.jpeg";
import gallery8 from "@/assets/gallery7.jpeg";
import gallery9 from "@/assets/gallery9.jpeg";
import fncci from "@/assets/FNCCI.png";
import icef from "@/assets/ICEF ecan.png";
import ielts from "@/assets/IELTS.png";
import nepalChamber from "@/assets/Nepal Chamber of Commerse.png";
import heroImage from "@/assets/Hero_image.jpeg";
import presidentPicnic from "@/assets/president_picnic.jpg";
import ecanElection from "@/assets/ecan_election.jpg";
import ecanProtocol from "@/assets/ecan_protocal .jpg";
import { board, events, services } from "@/data/board";

// Import board member photos
import president from "@/assets/1_-_President_-_Laxman_Andrew_Poudel.jpeg";
import pastPresident from "@/assets/2_-_Seshraj_Bhattarai.png";
import vp1 from "@/assets/3_-_Vice_President_-_Bashudeb_Dahal.jpeg";
import vp2 from "@/assets/4_-_Vice_President_-_Bikalp_Raj_Pokhrel_-_07.jpeg";
import vp3 from "@/assets/5._Geeta_Siwakoti.png";
import genSec from "@/assets/6_-_General_Secretary_-_Bhaba_Nath_Humagai_-.jpeg";
import sec1 from "@/assets/7_-_Secretary_-_SUraj_Silwal.jpeg";
import sec2 from "@/assets/08_-_Secretary_-_Ashik_Karki_-_01.jpeg";
import treasurer from "@/assets/9_-_Treasurer_-_Sadhana_Pudasaini_-_02.jpeg";
import jointTreasurer from "@/assets/10_-_Joint_Treasurer_-_Govinda_Khanal_-_01.jpeg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ECAN — Educational Consultancy Association of Nepal" },
      {
        name: "description",
        content:
          "Since 1997, ECAN has united Nepal's educational consultancies — guiding students into international higher education with integrity and care.",
      },
    ],
  }),
});

const eventImages = [ecanElection, presidentPicnic, ecanProtocol];
const boardPhotos = [
  president,
  pastPresident,
  vp1,
  vp2,
  vp3,
  genSec,
  sec1,
  sec2,
  treasurer,
  jointTreasurer,
];

// ── Reusable animated background lines ───────────────────────────────────────
function JourneyLines({ variant = "light" }: { variant?: "light" | "dark" }) {
  const r = variant === "dark" ? "255,255,255" : "0,90,112"; // Primary Teal
  const g = variant === "dark" ? "212,160,23" : "212,160,23"; // Gold
  const n = variant === "dark" ? "255,255,255" : "15,31,61"; // Navy
  const op = variant === "dark" ? 0.07 : 0.12;
  const opG = variant === "dark" ? 0.06 : 0.1;
  const opN = variant === "dark" ? 0.04 : 0.05;

  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id={`ar-${variant}`}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill={`rgba(${r},${op})`} />
        </marker>
        <marker
          id={`ag-${variant}`}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill={`rgba(${g},${opG})`} />
        </marker>
        <linearGradient id={`lg1-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={`rgba(${r},0)`} />
          <stop offset="50%" stopColor={`rgba(${r},${op})`} />
          <stop offset="100%" stopColor={`rgba(${g},${opG})`} />
        </linearGradient>
        <linearGradient id={`lg2-${variant}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={`rgba(${g},0)`} />
          <stop offset="60%" stopColor={`rgba(${g},${opG})`} />
          <stop offset="100%" stopColor={`rgba(${r},${opN})`} />
        </linearGradient>
      </defs>

      <motion.path
        d="M -50,520 C 200,480 400,200 750,80 S 1050,40 1280,20"
        fill="none"
        stroke={`url(#lg1-${variant})`}
        strokeWidth="1.5"
        strokeDasharray="8 6"
        markerEnd={`url(#ar-${variant})`}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
      />
      <motion.path
        d="M -30,380 C 150,340 350,260 600,180 S 900,100 1250,60"
        fill="none"
        stroke={`url(#lg2-${variant})`}
        strokeWidth="1"
        strokeDasharray="5 8"
        markerEnd={`url(#ag-${variant})`}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
      />

      <circle r="3.5" fill={`rgba(${r},0.4)`}>
        <animateMotion
          dur="7s"
          repeatCount="indefinite"
          path="M -50,520 C 200,480 400,200 750,80 S 1050,40 1280,20"
        />
      </circle>
    </svg>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

function Index() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <About />
      <President />
      <Events />
      <Gallery />
      <Board />
      <Recognitions />
      <AppCTA />
    </>
  );
}

function Hero() {
  const slides = [heroImage, ecanElection, presidentPicnic, ecanProtocol, gallery8, gallery9];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  function goTo(idx: number) {
    setCurrent(idx);
  }

  return (
    <section className="relative pt-16 md:pt-20 pb-24 md:pb-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* ── Background decoration ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[-5%] right-[-5%] w-[45rem] h-[45rem] rounded-full bg-[var(--primary)]/5 blur-[120px]"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-5%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-[var(--gold)]/8 blur-[100px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <JourneyLines variant="light" />
      </div>

      <div className="container-page relative">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* ── Left content ── */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md px-4 py-2 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                </span>
                <span className="text-label text-[var(--navy)]">Smart ECAN 2.0 is Live</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-8 text-hero text-[var(--navy)] leading-[1.1]"
            >
              Empowering Nepal's <br />
              <span className="text-[var(--primary)] relative">
                Future Leaders
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[var(--gold)]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span> <br />
              to Reach the World.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 text-[17px] font-medium text-[var(--slate)] max-w-xl leading-relaxed"
            >
              ECAN is the national heartbeat of Nepal's educational consultancies. 
              Since 1997, we've guided over <span className="text-[var(--navy)] font-bold">100,000 students</span> to 
              international success through integrity and professional excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button asChild size="lg" className="h-14 px-8 rounded-2xl shadow-xl shadow-[var(--primary)]/20">
                <Link to="/contact">
                  Become a Member
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="h-14 px-8 rounded-2xl border-2 border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-all">
                <Link to="/members">
                  Find a Consultancy
                  <ArrowUpRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              {[
                { Icon: ShieldCheck, text: "Govt. Registered", color: "text-emerald-600" },
                { Icon: Globe2, text: "Global Network", color: "text-blue-600" },
                { Icon: Star, text: "600+ Members", color: "text-amber-500" },
              ].map(({ Icon, text, color }) => (
                <div key={text} className="flex items-center gap-2.5 group">
                  <div className={`h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center transition-all group-hover:scale-110 ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-[var(--navy)]/80">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right content ── */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Main carousel frame */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] bg-[var(--navy)] ring-1 ring-slate-200">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <img src={slides[current]} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/80 via-transparent to-black/10" />
                  </motion.div>
                </AnimatePresence>

                {/* Content Overlay */}
                <div className="absolute bottom-10 left-10 right-10 z-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-label mb-2">Our impact in focus</p>
                      <h3 className="text-white text-2xl font-bold font-display">
                        Bridging aspirations to <br /> global opportunities.
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)} className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all flex items-center justify-center">
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button onClick={() => setCurrent((c) => (c + 1) % slides.length)} className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all flex items-center justify-center">
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress lines */}
                  <div className="mt-8 flex gap-2">
                    {slides.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => goTo(i)}
                        className="flex-1 h-1 rounded-full overflow-hidden bg-white/20"
                      >
                        <motion.div 
                          className="h-full bg-[var(--gold)]"
                          initial={false}
                          animate={{ 
                            width: i === current ? "100%" : i < current ? "100%" : "0%" 
                          }}
                          transition={{ duration: i === current ? 5 : 0.4, ease: "linear" }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating success card */}
              <motion.div
                className="absolute -bottom-8 -left-8 bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-30 hidden sm:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[var(--navy)] leading-none tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
                      27+
                    </p>
                    <p className="text-xs font-bold text-[var(--slate)] mt-1 uppercase tracking-wider">Years of Excellence</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Background elements for depth */}
            <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-[var(--gold)]/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 h-80 w-80 rounded-[4rem] bg-[var(--primary)]/5 rotate-12 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({
  target,
  suffix,
  label,
  sub,
  color,
  index,
}: {
  target: number;
  suffix: string;
  label: string;
  sub: string;
  color: string;
  index: number;
}) {
  const { count, ref } = useCountUp(target, 1600 + index * 100);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center justify-center py-12 px-8 text-center group transition-all"
    >
      <div className="absolute inset-0 bg-[var(--primary)]/0 group-hover:bg-[var(--primary)]/[0.03] transition-colors duration-500 rounded-3xl" />
      <div className="relative">
        <span className={`text-5xl md:text-6xl font-black tabular-nums font-display ${color}`}>
          {count}
        </span>
        <span className={`text-3xl font-bold ${color}`}>
          {suffix}
        </span>
        <motion.div
          className="h-1.5 w-12 bg-[var(--gold)] rounded-full mx-auto mt-2"
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
        />
      </div>
      <p className="mt-6 text-lg font-bold text-[var(--navy)] leading-tight">{label}</p>
      <p className="mt-2 text-sm font-medium text-[var(--slate)] tracking-wide uppercase">{sub}</p>
    </motion.div>
  );
}

function Stats() {
  const stats = [
    {
      target: 27,
      suffix: "+",
      label: "Years of Trust",
      sub: "Established 1997",
      color: "text-[var(--primary)]",
    },
    {
      target: 600,
      suffix: "+",
      label: "Accredited Members",
      sub: "Verified Agencies",
      color: "text-[var(--navy)]",
    },
    {
      target: 40,
      suffix: "+",
      label: "Global Destinations",
      sub: "Across 6 Continents",
      color: "text-[var(--primary)]",
    },
    {
      target: 100,
      suffix: "K+",
      label: "Successful Students",
      sub: "Global Impact",
      color: "text-[var(--navy)]",
    },
  ];

  return (
    <section className="relative py-12 bg-white">
      <div className="container-page">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-[3rem] border border-slate-100 shadow-sm bg-slate-50/30">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const ICONS = {
    "badge-check": (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.723 3.065 3.745 3.745 0 01-3.065.723A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.065-.723 3.745 3.745 0 01-.723-3.065A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.723-3.065 3.746 3.746 0 013.065-.723A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.065.723 3.746 3.746 0 01.723 3.065A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    globe: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    library: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    "pen-line": (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  } as Record<string, React.ReactNode>;

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="relative bg-slate-50 py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
      
      <div className="container-page relative">
        {/* Header */}
        <div className="max-w-3xl mb-20 text-center mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100"
          >
            <Sparkles className="h-4 w-4 text-[var(--gold)]" />
            The Foundation of Trust
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-heading text-[var(--navy)] leading-tight"
          >
            Four Pillars of <span className="italic text-[var(--primary)]">Excellence</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-[var(--slate)] font-medium leading-relaxed"
          >
            ECAN is the heartbeat of Nepal's educational consultancy sector. We don't just monitor —
            we lead, providing a platform where students can dream with absolute confidence.
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((s, i) => (
            <motion.div key={s.title} variants={cardVariants}>
              <Link
                to={s.href}
                className="group relative block h-full rounded-[2rem] border border-slate-200 bg-white p-10 lg:p-12 hover:border-[var(--primary)] hover:shadow-2xl hover:shadow-[var(--primary)]/10 transition-all duration-500 overflow-hidden"
              >
                {/* Subtle background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 to-[var(--primary)]/0 group-hover:from-[var(--primary)]/[0.04] group-hover:to-transparent transition-all duration-700 pointer-events-none" />

                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[var(--navy)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 shadow-sm">
                      {ICONS[s.icon]}
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-[var(--primary)]/40 uppercase tracking-widest">
                      Pillar 0{i + 1}
                    </span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  <h3 className="text-3xl font-bold text-[var(--navy)] group-hover:text-[var(--primary)] transition-colors duration-300 font-display leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-[16px] text-[var(--slate)] font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {s.body}
                  </p>
                </div>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-[var(--primary)] group-hover:w-full transition-all duration-700" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Button */}
        <div className="mt-20 text-center">
          <Button variant="outline" asChild size="lg" className="h-14 px-10 rounded-2xl border-2 font-bold hover:bg-white hover:border-[var(--primary)] hover:text-[var(--primary)]">
            <Link to="/about">
              Learn More About Our Mission
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="bg-[var(--navy)] text-white relative overflow-hidden py-24 lg:py-32">
      <img
        src={himalaya}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.08] scale-105 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy)] via-[var(--navy)]/95 to-transparent" />
      <JourneyLines variant="dark" />
      
      <div className="container-page relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="eyebrow text-[var(--gold)]"
            >
              Our Heritage & Vision
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-heading leading-[1.15]"
            >
              Broad Information. <br />
              <span className="text-[var(--gold)]">Patient Guidance.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-lg text-white/70 font-medium leading-relaxed"
            >
              Educational Consultancy Association of Nepal — registered in 1997 — exists to 
              bring proper information and guidance to parents and students considering studies abroad.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-body text-white/50"
            >
              We are an active association of professionals, endorsed by Nepali educationalists 
              and recognized instantly by overseas education providers — controlling, monitoring 
              and nurturing the country's environment for international education.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10"
            >
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-[var(--navy)] h-14 rounded-2xl px-8">
                <Link to="/about">
                  Discover Our History
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                Icon: Award,
                title: "Integrity",
                desc: "Honest counsel before commercial interest",
                color: "bg-amber-500/10 text-amber-500",
              },
              {
                Icon: ShieldCheck,
                title: "Stewardship",
                desc: "Monitoring members for high standards",
                color: "bg-blue-500/10 text-blue-500",
              },
              {
                Icon: TrendingUp,
                title: "Advocacy",
                desc: "Speaking for Nepali students in policy",
                color: "bg-emerald-500/10 text-emerald-500",
              },
              {
                Icon: CheckCircle2,
                title: "Care",
                desc: "Treating every journey as a family decision",
                color: "bg-rose-500/10 text-rose-500",
              },
            ].map(({ Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8 hover:bg-white/10 transition-colors group cursor-default"
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display">{title}</h3>
                <p className="mt-3 text-sm text-white/50 font-medium leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function President() {
  return (
    <section className="container-page py-24 md:py-32 overflow-hidden">
      <div className="grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 relative">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl z-10"
          >
            <img
              src={president}
              alt="Laxman (Andrew) Poudel, President of ECAN"
              loading="lazy"
              className="h-full w-full object-cover object-[50%_20%] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/60 via-transparent to-transparent" />
          </motion.div>
          {/* Decorative frame */}
          <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-slate-100 rounded-[2.5rem] -z-0" />
          <div className="absolute top-10 -left-10 h-40 w-40 bg-[var(--gold)]/10 blur-3xl -z-0" />
          
          <div className="absolute bottom-10 left-10 right-10 z-20">
            <p className="text-white text-xl font-bold font-display">Laxman (Andrew) Poudel</p>
            <p className="text-white/70 text-label mt-1">President, ECAN (2024-2026)</p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="eyebrow inline-flex items-center gap-2">
              <span className="h-px w-8 bg-[var(--primary)]" />
              President's Message
            </p>
            <Quote className="mt-8 h-12 w-12 text-[var(--gold)]/40" />
            <blockquote className="mt-6 text-3xl md:text-4xl font-bold leading-tight text-[var(--navy)] font-display">
              Sending a child abroad is more than an academic choice — it is a{" "}
              <span className="text-[var(--primary)]">leap of faith.</span>
            </blockquote>
            <p className="mt-8 text-lg text-[var(--slate)] font-medium leading-relaxed">
              With <span className="text-[var(--navy)] font-bold">Smart ECAN 2.0</span>, our mission is to 
              turn that leap into a confident step. We are building a future where ironclad security 
              meets world-class opportunity — ensuring that while our students chase their dreams, 
              their well-being remains our non-negotiable priority.
            </p>
            <div className="mt-10 flex items-center gap-6">
              <div className="h-px flex-1 bg-slate-100" />
              <div className="flex flex-col items-end">
                <p className="text-[var(--navy)] font-black uppercase tracking-tighter text-2xl italic opacity-20">Andrew Poudel</p>
                {/* <p className="text-[11px] font-bold text-[var(--slate)] uppercase tracking-[0.2em] mt-1">Official Signature</p> */}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Events() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events?limit=3")
      .then((res) => res.json())
      .then((json) => {
        const list = Array.isArray(json) ? json : (json.data ?? []);
        setItems(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setItems([]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="relative bg-white py-24 md:py-32 overflow-hidden border-t border-slate-100">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[var(--primary)]/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-[var(--gold)]/10 blur-[100px] rounded-full" />
      </div>

      <div className="container-page relative z-10">
        <div className="flex items-end justify-between flex-wrap gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="eyebrow"
            >
              Sector Calendar
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-heading text-[var(--navy)] leading-tight font-display"
            >
              Where the Industry <br className="hidden sm:block" />
              <span className="text-[var(--primary)]">Connects & Grows.</span>
            </motion.h2>
          </div>
          <Button variant="outline" asChild className="rounded-2xl h-14 px-8 border-2 font-bold hover:bg-[var(--navy)] hover:text-white hover:border-[var(--navy)] shadow-lg shadow-slate-100 transition-all">
            <Link to="/events">
              Explore All Events
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[480px] rounded-[2.5rem] bg-slate-50 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-10">
              {items.map((e, i) => {
                const startDate = e.starts_at ? new Date(e.starts_at) : null;
                return (
                  <motion.article
                    key={e.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="group flex flex-col h-full rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-[var(--primary)]/20 transition-all duration-500"
                  >
                    <Link to="/events/$id" params={{ id: e.id }} className="flex flex-col h-full">
                      <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                        {e.cover_image ? (
                          <img
                            src={e.cover_image}
                            alt={e.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 opacity-40 flex items-center justify-center">
                            <Calendar className="h-12 w-12 text-slate-300" strokeWidth={1} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <span className="absolute top-6 left-6 rounded-full bg-white/95 backdrop-blur-md px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--primary)] shadow-xl border border-white/20">
                          {e.event_type || 'General'}
                        </span>

                        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl p-2 flex flex-col items-center justify-center min-w-[56px] border border-white/20 shadow-xl group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500">
                          <span className="text-[9px] font-black uppercase leading-none opacity-60">{startDate ? format(startDate, "MMM") : "TBA"}</span>
                          <span className="text-lg font-bold leading-none mt-1">{startDate ? format(startDate, "dd") : "—"}</span>
                        </div>
                      </div>

                      <div className="p-10 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-[11px] font-black text-[var(--slate)] uppercase tracking-[0.15em] mb-5">
                          <Clock className="h-4 w-4 text-[var(--primary)]" />
                          {startDate ? format(startDate, "h:mm a") : "TBA"}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-[var(--navy)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 font-display leading-tight mb-5">
                          {e.title}
                        </h3>
                        
                        <div className="flex items-start gap-3 mb-8">
                          <MapPin className="h-4 w-4 text-[var(--gold)] shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-[var(--slate)] line-clamp-1">{e.location || "Venue TBA"}</p>
                        </div>
                        
                        <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] group-hover:text-[var(--primary)] transition-colors">
                            View Details
                          </span>
                          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 shadow-sm">
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
               <Calendar className="h-12 w-12 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 font-medium">No upcoming events at the moment.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Gallery() {
  const images = [
    { src: gallery1, span: "col-span-2 row-span-2", label: "Annual Day Celebration" },
    { src: gallery2, span: "col-span-1 row-span-1", label: "Board Meeting" },
    { src: gallery3, span: "col-span-1 row-span-1", label: "EduClave Summit" },
    { src: gallery4, span: "col-span-1 row-span-2", label: "Policy Dialogue" },
    { src: gallery6, span: "col-span-1 row-span-1", label: "Member Orientation" },
    { src: gallery7, span: "col-span-1 row-span-1", label: "Award Ceremony" },
    { src: gallery8, span: "col-span-1 row-span-1", label: "Annual Picnic" },
    { src: gallery9, span: "col-span-1 row-span-1", label: "ECAN Convention" },
  ];

  return (
    <section className="bg-[var(--navy)] py-24 md:py-32 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--gold)]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[var(--primary)]/20 blur-[100px] rounded-full" />
      </div>

      <div className="container-page relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <p className="eyebrow text-[var(--gold)]">Visual Journey</p>
            <h2 className="mt-4 text-heading text-white leading-tight font-display">
              Capturing Our <span className="italic text-[var(--gold)]">Milestones</span>
            </h2>
          </div>
          <p className="text-white/40 max-w-sm text-lg font-medium">
            Moments that define our commitment to excellence and community.
          </p>
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-3 gap-4 h-[900px] md:h-[750px]">
          {images.map(({ src, label }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`${i === 0 ? "col-span-2 row-span-2" : i === 3 ? "col-span-1 row-span-2" : "col-span-1 row-span-1"} relative group rounded-3xl overflow-hidden cursor-pointer shadow-lg`}
            >
              <img
                src={src}
                alt={label}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/90 via-[var(--navy)]/20 to-transparent opacity-40 group-hover:opacity-100 transition-all duration-500" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white text-[13px] font-bold uppercase tracking-[0.2em] mb-2 text-[var(--gold)]">ECAN Moments</p>
                <h4 className="text-white text-xl font-bold font-display">{label}</h4>
              </div>
              
              <div className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs font-black group-hover:scale-0 transition-transform duration-300">
                {String(i + 1).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-white/10 pt-10">
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((dot) => (
              <div key={dot} className={`h-1.5 rounded-full transition-all ${dot === 1 ? "w-10 bg-[var(--gold)]" : "w-1.5 bg-white/10"}`} />
            ))}
          </div>
          <Button variant="ghost" asChild className="text-white hover:bg-white/10 hover:text-[var(--gold)] rounded-xl font-bold">
            <a href="#" className="flex items-center gap-2">
              Explore Media Archives
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Board() {
  const preview = board.slice(0, 5);
  const rest = board.slice(5, 10);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-slate-50">
      <div className="container-page relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="eyebrow"
            >
              Executive Leadership
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-heading text-[var(--navy)] leading-tight font-display"
            >
              The Visionaries <br className="hidden md:block" />
              <span className="text-[var(--primary)]">Guiding Our Mission</span>
            </motion.h2>
          </div>
          <Button asChild size="lg" className="rounded-2xl h-14 px-8 shadow-xl shadow-[var(--primary)]/10">
            <Link to="/board-members">
              Meet Full Committee
              <ArrowUpRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8 mb-8">
          {preview.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 group-hover:shadow-2xl group-hover:border-[var(--primary)]/30 transition-all duration-500">
                <img
                  src={boardPhotos[i]}
                  alt={m.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-transparent to-transparent opacity-20 group-hover:opacity-60 transition-all duration-500" />
                
                {i === 0 && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-[var(--primary)] text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                      President
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 text-center">
                <h4 className="text-lg font-bold text-[var(--navy)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 font-display">
                  {m.name}
                </h4>
                <p className="text-[12px] font-bold text-[var(--slate)] uppercase tracking-widest mt-1 opacity-70">
                  {m.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
          {rest.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i + 5) * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 group-hover:shadow-2xl group-hover:border-[var(--primary)]/30 transition-all duration-500">
                <img
                  src={boardPhotos[i + 5]}
                  alt={m.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-transparent to-transparent opacity-20 group-hover:opacity-60 transition-all duration-500" />
              </div>
              <div className="mt-6 text-center">
                <h4 className="text-lg font-bold text-[var(--navy)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 font-display">
                  {m.name}
                </h4>
                <p className="text-[12px] font-bold text-[var(--slate)] uppercase tracking-widest mt-1 opacity-70">
                  {m.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-[var(--navy)] rounded-3xl p-8 md:p-10 relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/20 blur-3xl rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                <Zap className="h-8 w-8 text-[var(--gold)]" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold font-display">Accountable to Nepal.</h3>
                <p className="text-white/50 text-base font-medium mt-1">Elected practitioners carrying ECAN's mandate forward.</p>
              </div>
            </div>
            <Button asChild variant="tonal" className="bg-white text-[var(--navy)] hover:bg-[var(--gold)] hover:text-white h-14 rounded-2xl px-10 transition-all duration-300 shadow-xl">
              <Link to="/about">
                Our Constitution
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Recognitions() {
  const logos = [
    { src: nepalChamber, alt: "Nepal Chamber of Commerce" },
    { src: ielts, alt: "British Council IELTS" },
    { src: fncci, alt: "FNCCI" },
    { src: icef, alt: "ICEF" },
  ];

  return (
    <section className="bg-white py-20 border-y border-slate-100">
      <div className="container-page">
        <div className="flex flex-col items-center gap-12">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--slate)] opacity-40">Endorsed & Recognized By</p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24">
            {logos.map(({ src, alt }) => (
              <div
                key={alt}
                className="flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 scale-90 hover:scale-105"
              >
                <img src={src} alt={alt} className="h-16 md:h-20 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AppCTA() {
  return (
    <section className="bg-slate-50 py-24 md:py-32 overflow-hidden border-b border-slate-100 relative">
      <div className="container-page relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="eyebrow inline-flex items-center gap-2">
                <span className="h-px w-8 bg-[var(--primary)]" />
                Official Application
              </p>
              <h2 className="mt-6 text-heading leading-tight text-[var(--navy)] font-display">
                ECAN Smart 2.0 <br />
                <span className="text-[var(--primary)]">Now in your Pocket.</span>
              </h2>
              <p className="mt-8 text-lg text-[var(--slate)] font-medium leading-relaxed max-w-lg">
                Experience seamless student verification, scholarship tracking, and event 
                registrations through our completely revamped mobile platform. 
                Bridging convenience with professional ethics.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.susankya.ecan"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[180px] flex items-center gap-4 rounded-2xl bg-[var(--navy)] px-6 py-4 text-white hover:bg-[var(--primary)] transition-all duration-300 shadow-xl shadow-[var(--navy)]/10"
                >
                  <svg className="h-8 w-8 shrink-0 text-[var(--gold)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-11.53L13.1 8.76 3.18 23.76zm16.4-10.2L16.4 11.9 13.1 8.76l3.3-3.14 3.18 1.66c.9.47.9 1.82 0 2.28zM2.4.24C2.1.56 2 1.02 2 1.56v20.88c0 .54.1 1 .4 1.32l.08.08 11.7-10.7v-.24L2.48.16 2.4.24zm10.7 11.52L2.4 1.24l.08-.08 11.7 10.7-.08.08z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Available on</p>
                    <p className="text-lg font-bold leading-tight font-display">Google Play</p>
                  </div>
                </a>

                <a
                  href="https://apps.apple.com/in/app/ecan-nepal/id1500849319"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-w-[180px] flex items-center gap-4 rounded-2xl border-2 border-[var(--navy)] bg-white px-6 py-4 text-[var(--navy)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300 shadow-sm"
                >
                  <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Download on</p>
                    <p className="text-lg font-bold leading-tight font-display">App Store</p>
                  </div>
                </a>
              </div>

              {/* Security indicators */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { Icon: ShieldCheck, text: "Encrypted Data", sub: "User privacy first" },
                  { Icon: Zap, text: "Instant Verification", sub: "Real-time lookups" },
                  { Icon: Download, text: "Regular Updates", sub: "New features weekly" },
                ].map(({ Icon, text, sub }) => (
                  <div key={text} className="flex flex-col gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[var(--primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--navy)]">{text}</p>
                      <p className="text-[12px] font-medium text-[var(--slate)] mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: app mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--gold)]/10 blur-[80px] rounded-full scale-125 -z-0" />
            <img
              src={appMockup}
              alt="ECAN Smart 2.0 Mobile App"
              className="w-full max-w-sm md:max-w-md h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] relative z-10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  Users,
  History,
  GitBranch,
  Info,
  Calendar,
  Mail,
  Newspaper,
  BookOpen,
  MessageSquareWarning,
  UserPlus,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "../ui/button";

// ── Dropdown configs ──────────────────────────────────────────────────────────

const aboutDropdown = [
  {
    to: "/about" as const,
    label: "About ECAN",
    desc: "Our mission, history and values",
    Icon: Info,
  },
  {
    to: "/events" as const,
    label: "Events",
    desc: "Annual days, picnics & policy dialogues",
    Icon: Calendar,
  },
  { to: "/contact" as const, label: "Contact", desc: "Get in touch with our team", Icon: Mail },
];

const boardDropdown = [
  {
    to: "/board-members" as const,
    label: "Board Members",
    desc: "Current executive board 2026 onwards",
    Icon: Users,
  },
  {
    to: "/branch-board" as const,
    label: "Branch Board",
    desc: "Regional branch executives across Nepal",
    Icon: GitBranch,
  },
  {
    to: "/past-board-members" as const,
    label: "Past Board Members",
    desc: "Leadership history since 1997",
    Icon: History,
  },
];

// ── Reusable dropdown panel ───────────────────────────────────────────────────

type DropdownItem = {
  to: string;
  label: string;
  desc: string;
  Icon: React.ElementType;
};

function DropdownPanel({ items }: { items: DropdownItem[] }) {
  const location = useLocation();
  return (
    <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-2xl z-50 overflow-hidden">
      {items.map(({ to, label, desc, Icon }) => {
        const active = location.pathname === to || location.pathname.startsWith(to + "/");
        return (
          <Link
            key={to}
            to={to as any}
            className={`flex items-start gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              active ? "bg-[var(--primary)]/5" : "hover:bg-slate-50"
            }`}
          >
            <div
              className={`mt-0.5 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                active 
                  ? "bg-[var(--primary)] text-white" 
                  : "bg-slate-100 text-[var(--navy)] group-hover:bg-[var(--primary)] group-hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <p
                className={`text-[15px] leading-tight ${
                  active ? "text-[var(--primary)] font-bold" : "text-[var(--navy)] font-semibold"
                }`}
              >
                {label}
              </p>
              <p className="text-caption text-[var(--slate)] mt-1 line-clamp-1">{desc}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ── Desktop dropdown trigger ──────────────────────────────────────────────────

function NavDropdown({
  label,
  items,
  isActive,
}: {
  label: string;
  items: DropdownItem[];
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className={`relative flex items-center gap-1.5 px-4 py-2 font-sans text-[15px] transition-colors rounded-md group ${
          isActive
            ? "text-[var(--primary)] font-bold"
            : "text-[var(--navy)]/80 hover:text-[var(--primary)] font-medium"
        }`}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        {isActive && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute bottom-[-4px] left-0 h-0.5 w-full bg-[var(--primary)] rounded-full"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 pt-2 z-50"
          >
            <DropdownPanel items={items} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Mobile accordion ──────────────────────────────────────────────────────────

function MobileAccordion({
  label,
  items,
  isActive,
}: {
  label: string;
  items: DropdownItem[];
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3.5 text-[15px] font-bold rounded-2xl transition-all ${
          isActive
            ? "text-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
            : "text-[var(--navy)]/80 hover:text-[var(--primary)] hover:bg-slate-50"
        }`}
      >
        <span className="flex items-center gap-3">
          {label}
        </span>
        <div className={`p-1 rounded-full transition-colors ${open ? "bg-[var(--primary)] text-white" : "bg-slate-100"}`}>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-2 flex flex-col gap-1 border-l-2 border-slate-100 pl-4 py-2">
              {items.map(({ to, label, Icon }) => (
                <Link
                  key={to}
                  to={to as any}
                  className={`flex items-center gap-4 px-4 py-3 text-[14px] font-semibold rounded-xl transition-all ${
                    location.pathname === to
                      ? "text-[var(--primary)] bg-[var(--primary)]/5"
                      : "text-[var(--navy)]/70 hover:text-[var(--primary)] hover:bg-slate-50"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${location.pathname === to ? "bg-[var(--primary)] text-white" : "bg-slate-100"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────

const simpleLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/members" as const, label: "Members" },
  { to: "/news" as const, label: "News", Icon: Newspaper },
  { to: "/blog" as const, label: "Blog", Icon: BookOpen },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isAboutActive =
    location.pathname.startsWith("/about") ||
    location.pathname.startsWith("/events") ||
    location.pathname.startsWith("/contact");

  const isBoardActive =
    location.pathname.startsWith("/board-members") ||
    location.pathname.startsWith("/past-board-members") ||
    location.pathname.startsWith("/branch-board");

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden lg:block bg-[var(--navy)] text-white/70 text-[11px] font-medium tracking-wider">
        <div className="container-page flex items-center justify-between h-10">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 group cursor-default">
              <Phone className="h-3 w-3 text-[var(--gold)] group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white transition-colors">
                +977-4521487 · +977-4522267
              </span>
            </span>
            <div className="h-3 w-px bg-white/10" />
            <a href="mailto:info@ecan.org.np" className="flex items-center gap-2 group transition-colors hover:text-white">
              <Mail className="h-3 w-3 text-[var(--gold)] group-hover:scale-110 transition-transform" />
              info@ecan.org.np
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-[0.1em] text-[10px] text-white/40">Established 1997</span>
            <div className="h-3 w-px bg-white/10" />
            <span>Educational Consultancy Association of Nepal</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-slate-100"
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="container-page flex h-16 lg:h-20 items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Home */}
            <Link
              to="/"
              className={`relative px-4 py-2 font-sans text-[15px] transition-colors rounded-md group ${
                location.pathname === "/" 
                  ? "text-[var(--primary)] font-bold" 
                  : "text-[var(--navy)]/80 hover:text-[var(--primary)] font-medium"
              }`}
            >
              Home
              {location.pathname === "/" && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-[-4px] left-0 h-0.5 w-full bg-[var(--primary)] rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>

            {/* About dropdown */}
            <NavDropdown label="About" items={aboutDropdown} isActive={isAboutActive} />

            {/* Members */}
            <Link
              to="/members"
              className={`relative px-4 py-2 font-sans text-[15px] transition-colors rounded-md group ${
                location.pathname.startsWith("/members")
                  ? "text-[var(--primary)] font-bold"
                  : "text-[var(--navy)]/80 hover:text-[var(--primary)] font-medium"
              }`}
            >
              Members
              {location.pathname.startsWith("/members") && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-[-4px] left-0 h-0.5 w-full bg-[var(--primary)] rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>

            {/* Board dropdown */}
            <NavDropdown label="Board" items={boardDropdown} isActive={isBoardActive} />

            {/* News */}
            <Link
              to="/news"
              className={`relative px-4 py-2 font-sans text-[15px] transition-colors rounded-md flex items-center gap-2 group ${
                location.pathname.startsWith("/news")
                  ? "text-[var(--primary)] font-bold"
                  : "text-[var(--navy)]/80 hover:text-[var(--primary)] font-medium"
              }`}
            >
              <Newspaper className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              News
              {location.pathname.startsWith("/news") && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-[-4px] left-0 h-0.5 w-full bg-[var(--primary)] rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>

            {/* Blog */}
            <Link
              to="/blog"
              className={`relative px-4 py-2 font-sans text-[15px] transition-colors rounded-md flex items-center gap-2 group ${
                location.pathname.startsWith("/blog")
                  ? "text-[var(--primary)] font-bold"
                  : "text-[var(--navy)]/80 hover:text-[var(--primary)] font-medium"
              }`}
            >
              <BookOpen className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              Blog
              {location.pathname.startsWith("/blog") && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-[-4px] left-0 h-0.5 w-full bg-[var(--primary)] rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          </nav>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="tonal" asChild size="sm" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-5">
              <Link to="/complaint" className="flex items-center gap-2">
                <MessageSquareWarning className="h-4 w-4" />
                Complain
              </Link>
            </Button>
            <Button asChild size="sm" className="px-6">
              <Link to="/contact" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Become a Member
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
              mobileOpen 
                ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30" 
                : "bg-slate-50 border border-slate-200 text-[var(--navy)] hover:bg-slate-100"
            }`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="container-page py-8 flex flex-col gap-2 max-h-[calc(100vh-80px)] overflow-y-auto">
                {/* Home */}
                <Link
                  to="/"
                  className={`px-4 py-3.5 text-[15px] font-bold rounded-2xl transition-all ${
                    location.pathname === "/" 
                      ? "text-[var(--primary)] bg-[var(--primary)]/5 shadow-sm" 
                      : "text-[var(--navy)]/80 hover:text-[var(--primary)] hover:bg-slate-50"
                  }`}
                >
                  Home
                </Link>

                {/* About accordion */}
                <MobileAccordion label="About ECAN" items={aboutDropdown} isActive={isAboutActive} />

                {/* Members */}
                <Link
                  to="/members"
                  className={`px-4 py-3.5 text-[15px] font-bold rounded-2xl transition-all ${
                    location.pathname.startsWith("/members") 
                      ? "text-[var(--primary)] bg-[var(--primary)]/5 shadow-sm" 
                      : "text-[var(--navy)]/80 hover:text-[var(--primary)] hover:bg-slate-50"
                  }`}
                >
                  Member Directory
                </Link>

                {/* Board accordion */}
                <MobileAccordion label="Organization Board" items={boardDropdown} isActive={isBoardActive} />

                <div className="h-px bg-slate-100 my-2 mx-4" />

                {/* News */}
                <Link
                  to="/news"
                  className={`flex items-center justify-between px-4 py-3.5 text-[15px] font-bold rounded-2xl transition-all ${
                    location.pathname.startsWith("/news") 
                      ? "text-[var(--primary)] bg-[var(--primary)]/5 shadow-sm" 
                      : "text-[var(--navy)]/80 hover:text-[var(--primary)] hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Newspaper className="h-5 w-5 opacity-50" /> Latest News
                  </span>
                  <div className="bg-red-500 h-2 w-2 rounded-full animate-pulse" />
                </Link>

                {/* Blog */}
                <Link
                  to="/blog"
                  className={`flex items-center gap-3 px-4 py-3.5 text-[15px] font-bold rounded-2xl transition-all ${
                    location.pathname.startsWith("/blog") 
                      ? "text-[var(--primary)] bg-[var(--primary)]/5 shadow-sm" 
                      : "text-[var(--navy)]/80 hover:text-[var(--primary)] hover:bg-slate-50"
                  }`}
                >
                  <BookOpen className="h-5 w-5 opacity-50" /> Resources & Blog
                </Link>

                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 gap-3">
                  <Button asChild className="h-14 rounded-2xl shadow-lg shadow-[var(--primary)]/20">
                    <Link to="/contact">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Become a Member
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-14 rounded-2xl border-2 border-blue-100 text-blue-700 hover:bg-blue-50 hover:border-blue-200">
                    <Link to="/complaint">
                      <MessageSquareWarning className="h-5 w-5 mr-2" />
                      Lodge a Complaint
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

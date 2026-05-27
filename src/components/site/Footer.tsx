import { Link } from "@tanstack/react-router";
import { Globe, Send, PlayCircle, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--crimson)]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--gold)]/5 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none" />

      {/* Brand accent line */}
      <div className="h-1.5 bg-gradient-to-r from-[var(--crimson)] via-[var(--gold)] to-[var(--crimson)] relative z-10" />

      <div className="container-page py-20 lg:py-24 relative z-10">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4 space-y-8">
            <Logo light />
            <p className="text-white/60 text-[15px] leading-relaxed max-w-sm font-sans">
              Since 1997, ECAN has been the cornerstone of Nepal's educational consultancy sector, 
              ensuring integrity, professional ethics, and student welfare in international education.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { Icon: Globe, href: "https://ecan.org.np", label: "Website" },
                { Icon: Send, href: "#", label: "Telegram" },
                {
                  Icon: PlayCircle,
                  href: "https://play.google.com/store/apps/details?id=com.susankya.ecan",
                  label: "App",
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 hover:bg-[var(--crimson)] hover:border-[var(--crimson)] hover:text-white hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
            {/* Column 1 */}
            <div>
              <h4 className="text-white text-label mb-8 flex items-center gap-2">
                <span className="h-1 w-4 bg-[var(--gold)] rounded-full" />
                Organization
              </h4>
              <ul className="space-y-4 text-[15px] font-medium text-white/50">
                {[
                  { to: "/about", label: "About Us" },
                  { to: "/board-members", label: "Executive Board" },
                  { to: "/events", label: "Major Events" },
                  { to: "/contact", label: "Join Association" },
                  { to: "/complaint", label: "Grievance Cell" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to as any}
                      className="hover:text-white transition-colors inline-flex items-center gap-2 group"
                    >
                      {label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-white text-label mb-8 flex items-center gap-2">
                <span className="h-1 w-4 bg-[var(--crimson)] rounded-full" />
                Resources
              </h4>
              <ul className="space-y-4 text-[15px] font-medium text-white/50">
                {[
                  { to: "/news", label: "Press Releases" },
                  { to: "/blog", label: "Student Blog" },
                  { to: "/members", label: "Member Search" },
                  { to: "#", label: "IELTS Support" },
                  { to: "#", label: "Privacy Policy" },
                ].map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to as any}
                      className="hover:text-white transition-colors inline-flex items-center gap-2 group"
                    >
                      {label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white text-label mb-8 flex items-center gap-2">
                <span className="h-1 w-4 bg-white/20 rounded-full" />
                Get in Touch
              </h4>
              <ul className="space-y-6 text-[15px] font-medium text-white/50">
                <li className="flex items-start gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--gold)] group-hover:text-white transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="leading-relaxed">
                    Hattisar, Kathmandu
                    <br />
                    Nepal
                  </span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--gold)] group-hover:text-white transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span>+977 1-4521487</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--gold)] group-hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <a href="mailto:info@ecan.org.np" className="hover:text-white transition-colors">
                    info@ecan.org.np
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 relative z-10">
        <div className="container-page py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-white/30 font-medium">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p>© {new Date().getFullYear()} ECAN Nepal. All rights reserved.</p>
            <div className="hidden md:block h-3 w-px bg-white/10" />
            <p className="italic font-serif opacity-60">Bridging Nepal to the world since 1997.</p>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://play.google.com/store/apps/details?id=com.susankya.ecan" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[var(--gold)] transition-colors group">
              <PlayCircle className="h-5 w-5" />
              <span>Get the App</span>
            </a>
            <a href="https://ecan.org.np" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[var(--gold)] transition-colors">
              <Globe className="h-5 w-5" />
              <span>Legacy Site</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


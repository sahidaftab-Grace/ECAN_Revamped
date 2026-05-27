import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Phone, ArrowLeft, Crown, Users } from "lucide-react";
import { branches } from "@/data/branches";
import type { BranchMember } from "@/data/branches";

export const Route = createFileRoute("/branch-board/$branch")({
  component: BranchDetailPage,
  loader: ({ params }) => {
    const branch = branches.find((b) => b.slug === params.branch);
    if (!branch) throw notFound();
    return branch;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `ECAN ${loaderData?.name} Branch — Members` }],
  }),
});

// ── Role priority for sorting (president first) ───────────────────────────────
const ROLE_ORDER = [
  "president",
  "vice president",
  "immediate past president",
  "general secretary",
  "secretary",
  "treasurer",
  "joint treasurer",
];
function roleRank(role: string) {
  const r = role.toLowerCase();
  const idx = ROLE_ORDER.findIndex((k) => r.includes(k));
  return idx === -1 ? 99 : idx;
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({
  name,
  photo,
  gradient,
}: {
  name: string;
  photo: string | null;
  gradient: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className={`h-full w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      {photo ? (
        <img src={photo} alt={name} className="h-full w-full object-cover object-top" />
      ) : (
        <span className="text-3xl font-bold text-white/90 uppercase select-none">{initials}</span>
      )}
    </div>
  );
}

// ── President featured card ───────────────────────────────────────────────────
function PresidentCard({ member, gradient }: { member: BranchMember; gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 rounded-2xl overflow-hidden border-2 border-[var(--navy)] shadow-xl bg-[var(--navy)] text-white"
    >
      <div className="grid md:grid-cols-3">
        <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
          <Avatar name={member.name} photo={member.photo} gradient={gradient} />
        </div>
        <div className="md:col-span-2 flex flex-col justify-center p-8 md:p-12">
          <span className="inline-flex items-center gap-2 text-[var(--gold)] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            <Crown className="h-4 w-4" /> President
          </span>
          <h2
            className="text-3xl md:text-4xl leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {member.name}
          </h2>
          <p className="mt-4 text-white/60 leading-relaxed max-w-lg">
            Leading the branch executive committee and representing ECAN's mission of ethical
            educational consultancy in the region.
          </p>
          <div className="mt-6 h-px w-16 bg-[var(--gold)]/40" />
          <p className="mt-4 text-sm text-white/40 uppercase tracking-wider">
            ECAN Branch Executive Committee
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Regular member card ───────────────────────────────────────────────────────
function MemberCard({
  member,
  gradient,
  index,
}: {
  member: BranchMember;
  gradient: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group rounded-2xl border-2 border-[var(--border)] bg-white overflow-hidden hover:border-[var(--navy)] hover:shadow-lg transition-all"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[var(--muted)]">
        <Avatar name={member.name} photo={member.photo} gradient={gradient} />
      </div>
      <div className="p-5">
        <p
          className="text-base font-semibold text-[var(--navy)] leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {member.name}
        </p>
        <p className="mt-1 text-xs uppercase tracking-wider text-[var(--slate)]">{member.role}</p>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function BranchDetailPage() {
  const branch = Route.useLoaderData();

  const sorted = [...branch.members].sort((a, b) => roleRank(a.role) - roleRank(b.role));
  const president = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* ── Hero ── */}
      <header className="relative pt-16 pb-16 md:pt-20 md:pb-20 overflow-hidden bg-[var(--navy)]">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${branch.color} opacity-40 pointer-events-none`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/90 to-[var(--navy)]/60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--crimson)] via-[var(--gold)] to-transparent" />

        <div className="container-page relative">
          <Link
            to="/branch-board"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[var(--gold)] text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={15} /> Branch Network
          </Link>

          <p className="eyebrow text-[var(--gold)] flex items-center gap-1.5">
            <MapPin size={13} /> {branch.province}
          </p>
          <h1
            className="mt-4 text-[clamp(2rem,5vw,3.8rem)] leading-[1.1] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ECAN <span className="text-[var(--gold)]">{branch.name}</span>
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <Phone size={13} /> {branch.contact}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={13} /> {branch.members.length} executive members
            </span>
          </div>
        </div>
      </header>

      {/* ── Members ── */}
      <section className="container-page py-12 pb-24">
        <h2
          className="text-2xl font-semibold text-[var(--navy)] mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Executive Committee
        </h2>

        {/* President featured */}
        <PresidentCard member={president} gradient={branch.color} />

        {/* Rest of committee */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((m, i) => (
              <MemberCard key={m.name} member={m} gradient={branch.color} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Phone, ArrowLeft, Crown, Users } from "lucide-react";
import { branches } from "@/data/branches";
import type { Branch, BranchMember } from "@/data/branches";

const COMMITTEE_LIMIT = 9;

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

type EditableBranchMember = BranchMember & { sort_order?: number };

// ── Role priority for sorting ─────────────────────────────────────────────────
const ROLE_ORDER = [
  "founder president",
  "president",
  "vice president",
  "immediate past president",
  "general secretary",
  "secretary",
  "treasurer",
  "joint treasurer",
];
function roleRank(role: string) {
  const r = (role || "Executive Member").toLowerCase();
  const idx = ROLE_ORDER.findIndex((k) => r.includes(k));
  return idx === -1 ? 99 : idx;
}

function normalizeRole(role: string) {
  return (role || "Executive Member").trim().toLowerCase();
}

function isFounderPresident(member: EditableBranchMember) {
  const role = normalizeRole(member.role);
  return role.includes("founder") && role.includes("president");
}

function isPresident(member: EditableBranchMember) {
  const role = normalizeRole(member.role);
  return role.includes("president") && !role.includes("founder") && !role.includes("immediate past");
}

function uniqueMembers(members: Array<EditableBranchMember | undefined>) {
  const seen = new Set<string>();
  return members.filter((member): member is EditableBranchMember => {
    if (!member) return false;
    const key = `${member.name}-${member.role}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getCommitteeLayout(members: EditableBranchMember[]) {
  const sorted = [...members].sort((a, b) => {
    const rank = roleRank(a.role) - roleRank(b.role);
    if (rank !== 0) return rank;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
  const founderPresident = sorted.find(isFounderPresident);
  const president = sorted.find(isPresident) || sorted.find((member) => normalizeRole(member.role).includes("president"));
  const leaders = uniqueMembers([president, founderPresident]);
  const committee = sorted
    .filter((member) => !leaders.includes(member))
    .slice(0, Math.max(0, COMMITTEE_LIMIT - leaders.length));

  return { leaders, committee, totalShown: Math.min(sorted.length, COMMITTEE_LIMIT) };
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

// ── Featured leader card ──────────────────────────────────────────────────────
function PresidentCard({
  member,
  gradient,
}: {
  member: BranchMember;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden border-2 border-[var(--navy)] shadow-xl bg-[var(--navy)] text-white"
    >
      <div className="grid sm:grid-cols-5">
        <div className="aspect-[4/3] sm:col-span-2 sm:aspect-auto overflow-hidden">
          <Avatar name={member.name} photo={member.photo} gradient={gradient} />
        </div>
        <div className="sm:col-span-3 flex flex-col justify-center p-6 md:p-8">
          <span className="inline-flex items-center gap-2 text-[var(--gold)] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            <Crown className="h-4 w-4" /> {member.role}
          </span>
          <h2
            className="text-2xl md:text-3xl leading-tight"
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
  const fallbackBranch = Route.useLoaderData();
  const [branchRows, setBranchRows] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/branch-board")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load branch board"))))
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) setBranchRows(rows);
      })
      .catch(() => {
        if (!cancelled) setBranchRows([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const branch = useMemo(() => {
    if (!branchRows.length) return fallbackBranch;
    return groupBranchRows(branchRows).find((item) => item.slug === fallbackBranch.slug) || fallbackBranch;
  }, [branchRows, fallbackBranch]);

  const { leaders, committee, totalShown } = getCommitteeLayout(branch.members as EditableBranchMember[]);
  const displayLeaders = leaders.length > 0 ? leaders : branch.members.slice(0, 1);

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
              <Users size={13} /> {totalShown} executive members
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

        {/* Featured leaders */}
        {displayLeaders.length > 0 && (
          <div className="mb-10 grid lg:grid-cols-2 gap-6">
            {displayLeaders.map((member) => (
              <PresidentCard key={`${member.name}-${member.role}`} member={member} gradient={branch.color} />
            ))}
          </div>
        )}

        {/* Rest of committee */}
        {committee.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committee.map((m, i) => (
              <MemberCard key={`${m.name}-${m.role}`} member={m} gradient={branch.color} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function groupBranchRows(rows: any[]): Branch[] {
  const groups = new Map<string, any>();

  rows.forEach((row) => {
    const slug = row.branch_slug || "branch";
    if (!groups.has(slug)) {
      groups.set(slug, {
        slug,
        name: row.branch_name || slug,
        province: row.province || "",
        color: row.color || "from-slate-700 to-slate-900",
        accent: row.accent || "bg-slate-500",
        contact: row.contact || "",
        branch_sort_order: row.branch_sort_order ?? 0,
        members: [],
      });
    }

    const branch = groups.get(slug);
    branch.members.push({
      name: row.name,
      role: row.role || "Executive Member",
      photo: row.image_url || null,
      sort_order: row.sort_order ?? 0,
    });
  });

  return Array.from(groups.values())
    .map((branch) => ({
      ...branch,
      members: branch.members.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    }))
    .sort((a, b) => (a.branch_sort_order ?? 0) - (b.branch_sort_order ?? 0));
}

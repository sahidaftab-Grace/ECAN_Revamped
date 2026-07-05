import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Phone, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { branches, type Branch } from "@/data/branches";

const COMMITTEE_LIMIT = 9;

export const Route = createFileRoute("/branch-board")({
  component: BranchBoardPage,
  head: () => ({
    meta: [{ title: "Branch Board Members — ECAN" }],
  }),
});

function Avatar({
  name,
  photo,
  size = "lg",
}: {
  name: string;
  photo: string | null;
  size?: "lg" | "sm";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const dim = size === "lg" ? "h-20 w-20" : "h-12 w-12";
  const text = size === "lg" ? "text-xl" : "text-xs";

  return (
    <div
      className={`${dim} shrink-0 rounded-full overflow-hidden ring-2 ring-white/20 shadow-md bg-white/10 flex items-center justify-center`}
    >
      {photo ? (
        <img src={photo} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className={`${text} font-bold text-white uppercase`}>{initials}</span>
      )}
    </div>
  );
}

type EditableBranchMember = Branch["members"][number] & { sort_order?: number };

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
  const sorted = [...members].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const founderPresident = sorted.find(isFounderPresident);
  const president = sorted.find(isPresident) || sorted.find((member) => normalizeRole(member.role).includes("president"));
  const leaders = uniqueMembers([president, founderPresident]);
  const remaining = sorted.filter((member) => !leaders.includes(member));

  return {
    leaders,
    committee: remaining.slice(0, Math.max(0, COMMITTEE_LIMIT - leaders.length)),
    totalShown: Math.min(sorted.length, COMMITTEE_LIMIT),
  };
}

function LeaderLine({ member }: { member: EditableBranchMember }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={member.name} photo={member.photo} />
      <div>
        <p className="text-label text-white/60">{member.role}</p>
        <p className="text-body font-semibold text-white leading-tight">{member.name}</p>
      </div>
    </div>
  );
}

function BranchBoardPage() {
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

  const editableBranches = useMemo(() => {
    if (!branchRows.length) return branches;
    return groupBranchRows(branchRows);
  }, [branchRows]);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <PageHeader
        eyebrow="Regional Leadership"
        title={
          <>
            ECAN <span className="text-[var(--gold)]">Branch</span> Network
          </>
        }
        intro="Representing ethical educational consultancy across Nepal through eight regional executive committees."
      />

      <section className="container-page py-12">
        <div className="grid lg:grid-cols-2 gap-6">
          {editableBranches.map((branch, bi) => {
            const { leaders, committee, totalShown } = getCommitteeLayout(branch.members as EditableBranchMember[]);
            const displayLeaders = leaders.length > 0 ? leaders : branch.members.slice(0, 1);

            return (
              <motion.div
                key={branch.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: bi * 0.05 }}
              >
                <Link
                  to="/branch-board/$branch"
                  params={{ branch: branch.slug }}
                  className="group block bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 flex flex-col md:flex-row hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  {/* Sidebar Header */}
                  <div
                    className={`md:w-5/12 bg-gradient-to-br ${branch.color} p-6 text-white flex flex-col justify-between relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <MapPin size={80} />
                    </div>

                    <div className="relative z-10">
                      <p className="text-label text-white/70 mb-1">
                        {branch.province}
                      </p>
                      <h2 className="text-subheading text-white mb-4">ECAN {branch.name}</h2>

                      <div className="mt-6 space-y-4">
                        {displayLeaders.map((member) => (
                          <LeaderLine key={`${member.name}-${member.role}`} member={member} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-caption text-white/80">
                      <span className="flex items-center gap-2">
                        <Phone size={12} /> {branch.contact}
                      </span>
                      <span>{totalShown} members</span>
                    </div>
                  </div>

                  {/* Members List */}
                  <div className="md:w-7/12 p-4 flex flex-col justify-between bg-slate-50/50">
                    <div className="space-y-3">
                      {committee.map((m) => (
                        <div
                          key={`${m.name}-${m.role}`}
                          className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-slate-100 shadow-sm"
                        >
                          <Avatar name={m.name} photo={m.photo} size="sm" />
                          <div>
                            <p className="text-body-sm font-bold text-slate-800 leading-none mb-1">
                              {m.name}
                            </p>
                            <p className="text-label text-slate-500">
                              {m.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-1 text-caption font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-wider">
                      View all members <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
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

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Crown, Users } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { pastBoards } from "@/data/board";

export const Route = createFileRoute("/past-board-members")({
  component: PastBoardMembersPage,
});

function PastBoardMembersPage() {
  const [pastBoardRows, setPastBoardRows] = useState<any[]>([]);
  const [openTerm, setOpenTerm] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/past-board")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load past boards"))))
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) setPastBoardRows(rows);
      })
      .catch(() => {
        if (!cancelled) setPastBoardRows([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const editablePastBoards = useMemo(() => {
    if (!pastBoardRows.length) return pastBoards;

    const groups = new Map<string, any>();
    pastBoardRows.forEach((row) => {
      const term = row.term || "Past Term";
      if (!groups.has(term)) {
        groups.set(term, {
          term,
          term_sort_order: row.term_sort_order ?? 0,
          president: "",
          members: [],
        });
      }

      const group = groups.get(term);
      const member = {
        name: row.name,
        role: row.role,
        image: row.image_url || "",
        sort_order: row.sort_order ?? 0,
      };

      group.members.push(member);
      if (!group.president && row.role?.toLowerCase() === "president") {
        group.president = row.name;
      }
    });

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        president: group.president || group.members[0]?.name || "",
        members: group.members.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      }))
      .sort((a, b) => (a.term_sort_order ?? 0) - (b.term_sort_order ?? 0));
  }, [pastBoardRows]);

  useEffect(() => {
    if (!openTerm && editablePastBoards[0]?.term) {
      setOpenTerm(editablePastBoards[0].term);
    }
  }, [editablePastBoards, openTerm]);

  return (
    <>
      <PageHeader
        eyebrow="Leadership History"
        title={
          <>
            Past Board <span className="text-[var(--gold)]">Members</span>
          </>
        }
        intro="A record of the dedicated leaders who have steered ECAN since its founding in 1997."
      />

      <section className="container-page py-12 pb-24 max-w-4xl">
        {/* Timeline nav */}
        <div className="flex flex-wrap gap-2 mb-10">
          {editablePastBoards.map((pb) => (
            <button
              key={pb.term}
              onClick={() => setOpenTerm(pb.term)}
              className={`px-4 py-2 rounded-full text-label border-2 transition-all ${
                openTerm === pb.term
                  ? "bg-[var(--navy)] border-[var(--navy)] text-white"
                  : "border-[var(--border)] text-[var(--navy)]/70 hover:border-[var(--navy)] hover:text-[var(--navy)]"
              }`}
            >
              {pb.term}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {editablePastBoards.map((pb) => {
            const isOpen = openTerm === pb.term;
            return (
              <div
                key={pb.term}
                className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[var(--navy)] shadow-lg"
                    : "border-[var(--border)] hover:border-[var(--navy)]/40"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setOpenTerm(isOpen ? "" : pb.term)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isOpen
                          ? "bg-[var(--navy)] text-white"
                          : "bg-[var(--muted)] text-[var(--navy)]"
                      }`}
                    >
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-title text-[var(--navy)]">
                        {pb.term} Executive Board
                      </p>
                      <p className="text-body-sm text-[var(--slate)] flex items-center gap-1.5 mt-0.5">
                        <Crown className="h-3.5 w-3.5 text-[var(--gold)]" />
                        President: {pb.president}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-[var(--navy)] transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Members list */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 border-t border-[var(--border)]">
                        <div className="grid sm:grid-cols-2 gap-3 pt-5">
                          {pb.members.map((m, i) => (
                            <motion.div
                              key={m.name}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className={`flex items-center gap-4 rounded-xl p-4 ${
                                m.role === "President"
                                  ? "bg-[var(--navy)] text-white"
                                  : "bg-[var(--muted)]"
                              }`}
                            >
                              {/* Avatar — photo if available, else initials */}
                              <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/20">
                                {m.image ? (
                                  <img
                                    src={m.image}
                                    alt={m.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div
                                    className={`h-full w-full flex items-center justify-center font-bold text-sm ${
                                      m.role === "President"
                                        ? "bg-white/20 text-white"
                                        : "bg-[var(--crimson)]/10 text-[var(--crimson)]"
                                    }`}
                                  >
                                    {m.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .slice(0, 2)
                                      .join("")}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p
                                  className={`text-body-sm font-semibold leading-tight truncate ${
                                    m.role === "President" ? "text-white" : "text-[var(--navy)]"
                                  }`}
                                >
                                  {m.name}
                                </p>
                                <p
                                  className={`text-caption mt-0.5 ${
                                    m.role === "President" ? "text-white/70" : "text-[var(--slate)]"
                                  }`}
                                >
                                  {m.role}
                                </p>
                              </div>
                              {m.role === "President" && (
                                <Crown className="h-4 w-4 text-[var(--gold)] ml-auto flex-shrink-0" />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

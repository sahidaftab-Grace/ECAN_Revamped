import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Phone, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { branches } from "@/data/branches";

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

function BranchBoardPage() {
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
          {branches.map((branch, bi) => (
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

                    <div className="flex items-center gap-3 mt-6">
                      <Avatar name={branch.members[0].name} photo={branch.members[0].photo} />
                      <div>
                        <p className="text-label text-white/60">President</p>
                        <p className="text-body font-semibold text-white leading-tight">{branch.members[0].name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-caption text-white/80">
                    <Phone size={12} /> {branch.contact}
                  </div>
                </div>

                {/* Members List */}
                <div className="md:w-7/12 p-4 flex flex-col justify-between bg-slate-50/50">
                  <div className="space-y-3">
                    {branch.members.slice(1).map((m) => (
                      <div
                        key={m.name}
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
          ))}
        </div>
      </section>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Search, MapPin, Globe2, ArrowUpRight, Loader2, Phone, Mail, Copy, UsersRound, Sparkles, Filter, X } from "lucide-react";
import { members } from "@/data/members";
import type { Member } from "@/lib/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/members")({
  component: MembersPage,
  head: () => ({
    meta: [
      { title: "Member Directory — ECAN" },
      {
        name: "description",
        content:
          "Explore ECAN's directory of vetted member consultancies across Nepal — your starting point for trusted abroad-study guidance.",
      },
    ],
  }),
});

// ── Background Decoration ─────────────────────────────────────────────────────
function Decoration() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <motion.div
        className="absolute top-[10%] right-[-5%] w-[45rem] h-[45rem] rounded-full bg-[var(--primary)]/5 blur-[120px]"
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-[var(--gold)]/8 blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

// ── Member Card ───────────────────────────────────────────────────────────────
function MemberCard({ m, index, handleCopy }: { m: Member; index: number; handleCopy: (t: string, l: string) => void }) {
  return (
    <motion.article
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: index * 0.03 }}
      className="group rounded-[2rem] border border-slate-100 bg-white p-8 hover:border-[var(--primary)]/30 hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start justify-between">
        {m.logo_url ? (
          <div className="h-16 w-16 rounded-2xl border border-slate-100 p-2 bg-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src={m.logo_url}
              alt={m.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="h-16 w-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-xl shadow-inner transition-transform group-hover:scale-105">
            {m.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
        {m.est && (
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            Est. {m.est}
          </span>
        )}
      </div>

      <h3
        className="mt-6 text-2xl font-bold text-[var(--navy)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 font-display leading-tight h-14"
        title={m.name}
      >
        {m.name}
      </h3>

      <div className="mt-6 flex-grow space-y-3">
        <div className="flex items-center gap-3 text-[15px] font-medium text-[var(--slate)]">
          <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-[var(--primary)] shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="truncate" title={m.city}>{m.city}</span>
        </div>
        
        <div className="flex items-center gap-3 text-[15px] font-medium text-[var(--navy)]/80">
          <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-[var(--gold)] shrink-0 group-hover:bg-[var(--gold)] group-hover:text-white transition-all">
            <Globe2 className="h-4 w-4" />
          </div>
          <span className="truncate" title={m.focus}>{m.focus}</span>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          {m.phone && (
            <div className="flex items-center gap-3 text-sm font-medium text-[var(--slate)] group/item">
              <Phone className="h-4 w-4 text-slate-300" /> 
              <span className="truncate">{m.phone}</span>
              <button 
                onClick={(e) => { e.preventDefault(); handleCopy(m.phone, 'Phone number'); }}
                className="ml-auto h-7 w-7 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-[var(--primary)] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Copy Phone"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          )}
          {m.email && (
            <div className="flex items-center gap-3 text-sm font-medium text-[var(--slate)] group/item">
              <Mail className="h-4 w-4 text-slate-300" /> 
              <span className="truncate">{m.email}</span>
              <button 
                onClick={(e) => { e.preventDefault(); handleCopy(m.email, 'Email address'); }}
                className="ml-auto h-7 w-7 rounded-lg flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-[var(--primary)] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Copy Email"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {m.website && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <a
            href={m.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-[var(--navy)] text-white h-12 text-sm font-bold hover:bg-[var(--primary)] transition-all shadow-lg shadow-[var(--navy)]/10"
          >
            Visit Consultancy Profile
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </motion.article>
  );
}

function MembersPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch members:", err);
        setItems([]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!Array.isArray(items)) return [];
    if (!q) return items;
    return items.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.focus.toLowerCase().includes(q),
    );
  }, [query, items]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      <Decoration />
      
      <PageHeader
        eyebrow="Member Directory"
        title={
          <>
            Vetted Consultancies. <br />
            <span className="text-[var(--gold)]">Honest Counsel.</span>
          </>
        }
        intro="Browse a curated directory of ECAN's member consultancies — each operating under a shared code of practice and professional standards."
      />

      <section className="container-page pb-32">
        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 p-8 mb-16 shadow-2xl shadow-slate-200/40 relative z-20"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 relative group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by consultancy name, city or destination focus…"
                className="w-full pl-16 pr-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 text-[16px] text-[var(--navy)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)]/50 focus:bg-white transition-all shadow-inner font-medium"
              />
            </div>
            
            <div className="flex items-center gap-4 shrink-0">
               <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                  <Filter className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-[var(--slate)]">Quick Search</span>
               </div>
               {query && (
                 <Button 
                   variant="ghost" 
                   onClick={() => setQuery("")}
                   className="rounded-2xl h-14 px-6 text-[var(--crimson)] hover:bg-[var(--crimson)]/5 font-bold"
                 >
                   <X className="h-4 w-4 mr-2" /> Reset
                 </Button>
               )}
            </div>
          </div>
        </motion.div>

        {/* Members grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[2rem] border border-slate-100 bg-white p-8 flex flex-col gap-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-3/4 mt-2" />
                  <div className="space-y-4 mt-4">
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-2xl mt-6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                 <h2 className="text-3xl font-bold text-[var(--navy)] font-display">Association Members</h2>
                 <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slate)]">
                   <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                   {filtered.length} {filtered.length === 1 ? 'Member' : 'Members'} Found
                 </div>
              </div>

              {filtered.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-32 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50"
                >
                  <div className="h-20 w-20 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <UsersRound className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--navy)] font-display">No consultancies found</h3>
                  <p className="text-[var(--slate)] font-medium mt-3 max-w-sm mx-auto">
                    We couldn't find any members matching your search. Try a different city or destination name.
                  </p>
                  <Button 
                    onClick={() => setQuery("")}
                    className="mt-8 rounded-2xl h-12 px-8 font-bold bg-[var(--navy)] hover:bg-[var(--primary)]"
                  >
                    Clear Search Query
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                  {filtered.map((m, i) => (
                    <MemberCard key={m.id} m={m} index={i} handleCopy={handleCopy} />
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

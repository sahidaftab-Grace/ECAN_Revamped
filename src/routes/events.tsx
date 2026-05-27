import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Loader2,
  ArrowRight,
  Sparkles,
  Send,
  Bell,
  Ticket,
  Search,
  Filter,
  X,
  Clock,
  ChevronRight,
  Map as MapIcon,
  PartyPopper,
  BookOpen,
  Users,
  Mic2,
  Globe,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  head: () => ({
    meta: [
      { title: "Events — ECAN" },
      {
        name: "description",
        content:
          "From annual days to policy dialogues — events that bring Nepal's educational consultancy sector together.",
      },
    ],
  }),
});

const EVENT_TYPE_LABELS: Record<string, string> = {
  annual_day: "Annual Day",
  picnic: "Picnic",
  policy_dialogue: "Policy Dialogue",
  workshop: "Workshop",
  general: "General Event",
};

const EVENT_TYPE_ICONS: Record<string, React.ElementType> = {
  annual_day: PartyPopper,
  picnic: Globe,
  policy_dialogue: Mic2,
  workshop: BookOpen,
  general: Ticket,
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  annual_day: "text-amber-600 bg-amber-50 border-amber-100",
  picnic: "text-emerald-600 bg-emerald-50 border-emerald-100",
  policy_dialogue: "text-blue-600 bg-blue-50 border-blue-100",
  workshop: "text-violet-600 bg-violet-50 border-violet-100",
  general: "text-slate-600 bg-slate-50 border-slate-100",
};

const EVENT_CATEGORIES = [
  { value: "all", label: "All Events" },
  { value: "annual_day", label: "Annual Days" },
  { value: "picnic", label: "Picnics" },
  { value: "policy_dialogue", label: "Policy Dialogues" },
  { value: "workshop", label: "Workshops" },
] as const;

// ── Background Decoration ─────────────────────────────────────────────────────
function Decoration() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <motion.div
        className="absolute top-[10%] left-[-5%] w-[45rem] h-[45rem] rounded-full bg-[var(--primary)]/5 blur-[120px]"
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-[var(--gold)]/8 blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

// ── Featured Event Card ──────────────────────────────────────────────────────
function FeaturedEvent({ event }: { event: any }) {
  const Icon = EVENT_TYPE_ICONS[event.event_type] || Ticket;
  const colors = EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.general;
  const startDate = event.starts_at ? new Date(event.starts_at) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-20"
    >
      <Link
        to="/events/$id"
        params={{ id: event.id }}
        className="group block relative rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden hover:border-[var(--primary)]/30 transition-all duration-700"
      >
        <div className="grid lg:grid-cols-12 items-stretch min-h-[480px]">
          {/* Image side */}
          <div className="lg:col-span-5 relative overflow-hidden bg-[var(--navy)]">
            {event.cover_image ? (
              <img
                src={event.cover_image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy)] to-[var(--primary)] opacity-90" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/80 via-transparent to-transparent opacity-60" />
            
            {/* Floating category badge */}
            <div className="absolute top-10 left-10">
              <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md bg-white/90 shadow-xl border border-white/20 text-[11px] font-black uppercase tracking-widest ${colors.split(' ')[0]}`}>
                <Icon className="h-4 w-4" />
                {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
              </span>
            </div>
            
            <div className="absolute bottom-10 left-10 right-10">
               <div className="flex items-center gap-4 text-white/90">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-center">
                     <span className="text-[10px] font-black uppercase leading-none opacity-60">{startDate ? format(startDate, "MMM") : "TBA"}</span>
                     <span className="text-xl font-bold leading-none mt-1">{startDate ? format(startDate, "dd") : "—"}</span>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--gold)]">Save the Date</p>
                    <p className="text-sm font-bold">{startDate ? format(startDate, "EEEE") : "Date TBA"}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Content side */}
          <div className="lg:col-span-7 p-12 md:p-20 flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
               <Icon className="h-48 w-48 rotate-12" strokeWidth={1} />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-[var(--gold)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--gold)]">Upcoming Highlight</span>
              {event.status === 'ongoing' && (
                <span className="flex items-center gap-1.5 ml-4">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-emerald-600">Happening Now</span>
                </span>
              )}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--navy)] group-hover:text-[var(--primary)] transition-colors leading-tight font-display">
              {event.title}
            </h2>
            
            <p className="mt-8 text-lg text-[var(--slate)] font-medium leading-relaxed line-clamp-3">
              {event.description}
            </p>
            
            <div className="mt-12 grid sm:grid-cols-2 gap-10 border-t border-slate-100 pt-12">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 shadow-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] opacity-50">Timing</p>
                  <p className="text-sm font-bold text-[var(--navy)] mt-0.5">
                    {startDate ? format(startDate, "h:mm a") : "TBA"} onwards
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] opacity-50">Venue</p>
                  <p className="text-sm font-bold text-[var(--navy)] mt-0.5 line-clamp-1">{event.location || "Location TBA"}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-14 flex items-center gap-6">
              <Button className="rounded-[1.25rem] h-14 px-10 group/btn shadow-xl shadow-[var(--primary)]/20 active:scale-95 transition-all">
                Event Details
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Button>
              
              {event.reg_url && (
                <button className="text-sm font-bold text-[var(--navy)] hover:text-[var(--primary)] transition-colors flex items-center gap-2 group/link">
                   Register Online <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Regular Event Card ────────────────────────────────────────────────────────
function EventCard({ event, index }: { event: any; index: number }) {
  const Icon = EVENT_TYPE_ICONS[event.event_type] || Ticket;
  const colors = EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.general;
  const startDate = event.starts_at ? new Date(event.starts_at) : null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to="/events/$id"
        params={{ id: event.id }}
        className="group block h-full bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-[var(--primary)]/20 transition-all duration-500 flex flex-col"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          {event.cover_image ? (
            <img
              src={event.cover_image}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 opacity-20`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <span className={`absolute top-6 left-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border shadow-sm backdrop-blur-md bg-white/95 text-[10px] font-black uppercase tracking-widest ${colors}`}>
            <Icon className="h-3.5 w-3.5" />
            {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
          </span>

          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 flex flex-col items-center justify-center min-w-[64px] border border-white/20 shadow-xl group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500">
             <span className="text-[10px] font-black uppercase leading-none opacity-60">{startDate ? format(startDate, "MMM") : "TBA"}</span>
             <span className="text-xl font-bold leading-none mt-1">{startDate ? format(startDate, "dd") : "—"}</span>
          </div>
        </div>

        <div className="p-10 flex flex-col flex-1">
          <div className="flex items-center gap-3 text-[11px] font-black text-[var(--slate)] uppercase tracking-[0.15em] mb-5">
             <Clock className="h-4 w-4 text-[var(--primary)]" />
             {startDate ? format(startDate, "h:mm a") : "TBA"}
          </div>
          
          <h2 className="text-2xl font-bold text-[var(--navy)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 font-display leading-tight mb-5">
            {event.title}
          </h2>
          
          <div className="flex items-start gap-3 mb-8">
             <MapPin className="h-4 w-4 text-[var(--gold)] shrink-0 mt-0.5" />
             <p className="text-sm font-medium text-[var(--slate)] line-clamp-1">{event.location || "Venue TBA"}</p>
          </div>
          
          <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)]">View Details</span>
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 shadow-sm">
               <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────
function EventsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
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

  const filtered = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((e) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q);
      const matchesCategory = category === "all" || e.event_type === category;
      return matchesQuery && matchesCategory;
    });
  }, [items, query, category]);

  const hasFilters = query || category !== "all";
  const featured = !hasFilters ? filtered[0] : null;
  const rest = !hasFilters ? filtered.slice(1) : filtered;

  return (
    <div className="relative overflow-hidden">
      <Decoration />
      
      <PageHeader
        eyebrow="Association Events"
        title={
          <>
            Where the Industry <br />
            <span className="text-[var(--gold)]">Connects & Grows.</span>
          </>
        }
        intro="Annual days, policy summits and member orientations — defining the heartbeat of Nepal's educational consultancy association."
      />

      <section className="container-page pb-32">
        {/* Modern Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 p-8 mb-20 shadow-2xl shadow-slate-200/40 relative z-20"
        >
          <div className="flex flex-col gap-8">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
              <input
                type="text"
                placeholder="Search events by title, venue or description…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 text-[16px] text-[var(--navy)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)]/50 focus:bg-white transition-all shadow-inner font-medium"
              />
            </div>

            <div className="flex flex-wrap gap-8 items-center justify-between">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                <div className="flex items-center gap-2 mr-2 text-[var(--slate)]">
                   <Filter className="h-4 w-4" />
                   <span className="text-[11px] font-black uppercase tracking-widest">Type:</span>
                </div>
                {EVENT_CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[12px] font-bold border-2 transition-all duration-300 ${
                      category === c.value
                        ? "bg-[var(--navy)] border-[var(--navy)] text-white shadow-lg shadow-[var(--navy)]/20"
                        : "border-slate-100 text-slate-500 hover:border-[var(--primary)] hover:text-[var(--primary)] bg-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {hasFilters && (
                <Button
                  variant="ghost"
                  onClick={() => { setQuery(""); setCategory("all"); }}
                  className="flex items-center gap-2 px-6 rounded-2xl text-[12px] font-bold text-[var(--crimson)] hover:bg-[var(--crimson)]/5 transition-colors"
                >
                  <X className="h-4 w-4" /> Reset Search
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Grid */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 text-[var(--slate)]">
              <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)] mb-6" />
              <span className="text-xl font-display font-bold text-[var(--navy)]">Synchronizing newsfeed…</span>
              <p className="text-sm font-medium mt-2">Connecting to ECAN's central announcement system.</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                 <h2 className="text-3xl font-bold text-[var(--navy)] font-display">
                    {category === 'all' ? 'Scheduled Activities' : `${EVENT_CATEGORIES.find(c => c.value === category)?.label}`}
                 </h2>
                 <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slate)]">
                   <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                   {filtered.length} {filtered.length === 1 ? 'Event' : 'Events'} Listed
                 </div>
              </div>

              {featured && <FeaturedEvent event={featured} />}
              
              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {rest.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-40 text-center border-2 border-dashed border-slate-200 rounded-[4rem] bg-slate-50/50"
            >
              <div className="h-24 w-24 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-8 text-slate-300">
                 <Calendar className="h-12 w-12" />
              </div>
              <h3 className="text-3xl font-bold text-[var(--navy)] font-display">No events found</h3>
              <p className="text-[var(--slate)] text-lg font-medium mt-4 max-w-md mx-auto leading-relaxed">
                We couldn't find any events matching your current search criteria. Try broadening your scope.
              </p>
              <Button
                variant="outline"
                onClick={() => { setQuery(""); setCategory("all"); }}
                className="mt-10 rounded-[1.25rem] h-14 px-10 font-bold border-2 hover:bg-[var(--navy)] hover:text-white"
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Subscription Section */}
      <section className="container-page pb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[4rem] bg-[var(--navy)] text-white p-12 md:p-24 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[var(--primary)]/20 blur-[100px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-[var(--gold)]/10 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-2.5 mb-10">
              <Bell className="h-4 w-4 text-[var(--gold)] animate-bounce" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">Association Alerts</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-display leading-[1.1]">
              Get Event Invitations <br />
              <span className="text-[var(--gold)] italic">Straight to your Inbox.</span>
            </h2>
            <p className="mt-10 text-white/60 text-lg md:text-xl font-medium leading-relaxed">
              Don't miss out on our annual gathering, policy summits and member orientations. 
              Join our mailing list for the latest industry updates.
            </p>
            <form className="mt-16 max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Send className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-[var(--gold)] transition-colors" />
                <input
                  type="email"
                  placeholder="Your email address…"
                  className="w-full rounded-[1.5rem] bg-white/5 border border-white/20 pl-14 pr-6 py-5 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold)] focus:bg-white/10 transition-all shadow-inner text-[16px]"
                />
              </div>
              <Button
                type="button"
                className="rounded-[1.5rem] h-[64px] px-10 font-black uppercase tracking-widest text-[12px] bg-[var(--primary)] hover:bg-[var(--primary)]/90 shadow-2xl shadow-[var(--primary)]/20 active:scale-95 transition-all"
              >
                Join Now
              </Button>
            </form>
            <p className="mt-10 text-[11px] text-white/20 font-bold uppercase tracking-[0.3em] italic">
              Trusted by 600+ vetted consultancy agencies nationwide.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

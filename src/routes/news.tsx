import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Tag,
  X,
  Megaphone,
  Award,
  Handshake,
  FileText,
  PartyPopper,
  Loader2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { newsItems, NEWS_CATEGORIES } from "@/data/news";
import type { NewsItem } from "@/data/news";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "News — ECAN" },
      {
        name: "description",
        content:
          "Latest news, announcements and updates from the Educational Consultancy Association of Nepal.",
      },
    ],
  }),
});

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  announcement: Megaphone,
  policy: FileText,
  event: PartyPopper,
  partnership: Handshake,
  award: Award,
};

const CATEGORY_COLORS: Record<string, string> = {
  announcement: "bg-blue-50 text-blue-700 border-blue-100",
  policy: "bg-violet-50 text-violet-700 border-violet-100",
  event: "bg-amber-50 text-amber-700 border-amber-100",
  partnership: "bg-emerald-50 text-emerald-700 border-emerald-100",
  award: "bg-rose-50 text-rose-700 border-rose-100",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  announcement: "from-blue-500 to-blue-700",
  policy: "from-violet-500 to-violet-700",
  event: "from-amber-500 to-amber-700",
  partnership: "from-emerald-500 to-emerald-700",
  award: "from-rose-500 to-rose-700",
};

function formatDate(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Background Decoration ─────────────────────────────────────────────────────
function Decoration() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <motion.div
        className="absolute top-[15%] right-[-5%] w-[45rem] h-[45rem] rounded-full bg-[var(--primary)]/5 blur-[120px]"
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[5%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-[var(--gold)]/8 blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

// ── Featured card ─────────────────────────────────────────────────────────────
function FeaturedCard({ item }: { item: NewsItem }) {
  const Icon = CATEGORY_ICONS[item.category] || Megaphone;
  const gradient = CATEGORY_GRADIENTS[item.category] || "from-slate-500 to-slate-700";
  const colors = CATEGORY_COLORS[item.category] || "bg-slate-50 text-slate-700 border-slate-100";
  const displayImage = item.image || (item as any).cover_image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16"
    >
      <Link
        to="/news/$id"
        params={{ id: item.id }}
        className="group block relative rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden hover:border-[var(--primary)]/30 transition-all duration-700"
      >
        <div className="grid lg:grid-cols-12 items-stretch min-h-[440px]">
          {/* Image side */}
          <div className="lg:col-span-5 relative overflow-hidden bg-[var(--navy)]">
            {displayImage ? (
              <img
                src={displayImage}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/60 via-transparent to-transparent opacity-60" />
            
            {/* Floating category badge */}
            <div className="absolute top-8 left-8">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/90 shadow-xl border border-white/20 text-[11px] font-black uppercase tracking-widest ${colors.split(' ')[1]}`}>
                <Icon className="h-3.5 w-3.5" />
                {item.category}
              </span>
            </div>
          </div>

          {/* Content side */}
          <div className="lg:col-span-7 p-10 md:p-16 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-[var(--gold)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--gold)]">Latest Headline</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--navy)] group-hover:text-[var(--primary)] transition-colors leading-[1.1] font-display">
              {item.title}
            </h2>
            
            <p className="mt-6 text-lg text-[var(--slate)] font-medium leading-relaxed line-clamp-3">
              {item.excerpt}
            </p>
            
            <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-slate-100 pt-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-[var(--primary)]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] opacity-50">Released</p>
                  <p className="text-sm font-bold text-[var(--navy)]">{formatDate(item.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-[var(--primary)]">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] opacity-50">Source</p>
                  <p className="text-sm font-bold text-[var(--navy)]">{item.author}</p>
                </div>
              </div>
              
              <div className="flex-1" />
              
              <Button className="rounded-2xl h-12 px-6 group/btn shadow-lg shadow-[var(--primary)]/20">
                View Full Update
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Regular card ──────────────────────────────────────────────────────────────
function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const Icon = CATEGORY_ICONS[item.category] || Megaphone;
  const colors = CATEGORY_COLORS[item.category] || "bg-slate-50 text-slate-700 border-slate-100";
  const displayImage = item.image || (item as any).cover_image;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to="/news/$id"
        params={{ id: item.id }}
        className="group block h-full bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-[var(--primary)]/20 transition-all duration-500 flex flex-col"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          {displayImage ? (
            <img
              src={displayImage}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENTS[item.category] || 'from-slate-100 to-slate-200'} opacity-20`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border shadow-sm backdrop-blur-md bg-white/95 text-[10px] font-black uppercase tracking-widest ${colors.split(' ')[1]}`}>
            <Icon className="h-3 w-3" />
            {item.category}
          </span>
        </div>

        <div className="p-8 flex flex-col flex-1">
          <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--slate)] uppercase tracking-[0.1em] mb-4">
             <Calendar className="h-3.5 w-3.5 text-[var(--primary)]" />
             {formatDate(item.date)}
          </div>
          
          <h2 className="text-2xl font-bold text-[var(--navy)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 font-display leading-tight mb-4">
            {item.title}
          </h2>
          
          <p className="text-[15px] text-[var(--slate)] font-medium leading-relaxed line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity flex-1">
            {item.excerpt}
          </p>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--slate)] uppercase tracking-wider">Source: {item.author}</span>
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 shadow-sm">
               <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function NewsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        const apiItems = Array.isArray(data) ? data : [];
        // Deduplicate by ID
        const combined = [...apiItems];
        newsItems.forEach(staticItem => {
          if (!combined.find(i => i.id === staticItem.id)) {
            combined.push(staticItem);
          }
        });
        setItems(combined);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
        setItems(newsItems);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q);
      const matchesCategory = category === "all" || item.category === category;
      const matchesFrom = !dateFrom || item.date >= dateFrom;
      const matchesTo = !dateTo || item.date <= dateTo;
      return matchesQuery && matchesCategory && matchesFrom && matchesTo;
    });
  }, [items, query, category, dateFrom, dateTo]);

  const hasFilters = query || category !== "all" || dateFrom || dateTo;
  const featured = !hasFilters ? filtered[0] : null;
  const rest = !hasFilters ? filtered.slice(1) : filtered;

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <div className="relative overflow-hidden">
      <Decoration />
      
      <PageHeader
        eyebrow="Official Announcements"
        title={
          <>
            ECAN <span className="text-[var(--gold)]">News</span>
          </>
        }
        intro="Stay updated with the latest policy changes, partnership announcements, and association milestones defining the future of consultancy in Nepal."
      />

      <section className="container-page pb-32">
        {/* Filter bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 p-8 mb-16 shadow-2xl shadow-slate-200/40 relative z-20"
        >
          <div className="flex flex-col gap-8">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
              <input
                type="text"
                placeholder="Search headlines or source…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 text-[16px] text-[var(--navy)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary)]/50 focus:bg-white transition-all shadow-inner font-medium"
              />
            </div>

            <div className="flex flex-wrap gap-8 items-center justify-between">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                <div className="flex items-center gap-2 mr-2 text-[var(--slate)]">
                   <Filter className="h-4 w-4" />
                   <span className="text-[11px] font-black uppercase tracking-widest">Type:</span>
                </div>
                {NEWS_CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[12px] font-bold border-2 transition-all duration-300 ${
                      category === c.value
                        ? "bg-[var(--navy)] border-[var(--navy)] text-white shadow-lg shadow-[var(--navy)]/20"
                        : "border-slate-100 text-slate-500 hover:border-[var(--primary)] hover:text-[var(--primary)] bg-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-50/50 rounded-2xl border border-slate-100 p-1.5">
                  <div className="flex items-center gap-2 px-3">
                    <Calendar className="h-4 w-4 text-[var(--primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)]">Date Range</span>
                  </div>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-[12px] font-bold text-[var(--navy)] focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                  <span className="text-slate-300">—</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-[12px] font-bold text-[var(--navy)] focus:outline-none focus:border-[var(--primary)] transition-all"
                  />
                </div>

                {hasFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-5 rounded-2xl text-[12px] font-bold text-[var(--crimson)] hover:bg-[var(--crimson)]/5 transition-colors"
                  >
                    <X className="h-4 w-4" /> Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-[var(--slate)]">
              <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)] mb-6" />
              <span className="text-lg font-display font-bold text-[var(--navy)]">Synchronizing newsfeed…</span>
              <p className="text-sm font-medium mt-2">Connecting to ECAN's central announcement system.</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-16">
              <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                 <h2 className="text-3xl font-bold text-[var(--navy)] font-display">
                    {category === 'all' ? 'Latest Headlines' : `${NEWS_CATEGORIES.find(c => c.value === category)?.label} Updates`}
                 </h2>
                 <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slate)]">
                   <Sparkles className="h-4 w-4 text-[var(--gold)]" />
                   {filtered.length} {filtered.length === 1 ? 'Headline' : 'Headlines'} Found
                 </div>
              </div>

              {featured && <FeaturedCard item={featured} />}
              
              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {rest.map((item, i) => (
                  <NewsCard key={item.id} item={item} index={i} />
                ))}
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50"
            >
              <div className="h-20 w-20 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
                 <Tag className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--navy)] font-display">No headlines found</h3>
              <p className="text-[var(--slate)] font-medium mt-3 max-w-sm mx-auto">
                We couldn't find any news matching your criteria. Try adjusting your search or resetting the filters.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-8 rounded-2xl h-12 px-8 font-bold border-2 hover:bg-[var(--navy)] hover:text-white"
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

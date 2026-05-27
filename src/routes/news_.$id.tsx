import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Megaphone,
  Award,
  Handshake,
  FileText,
  PartyPopper,
  Share2,
} from "lucide-react";
import { newsItems } from "@/data/news";
import type { NewsItem } from "@/data/news";

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/news_/$id")({
  component: NewsDetailPage,
  loader: async ({ params }: { params: { id: string } }) => {
    const { id } = params;

    try {
      const res = await fetch(`/api/news/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      return {
        _source: "db" as const,
        ...data,
        layout: (data.layout ?? "classic") as "classic" | "hero-image" | "split" | "magazine",
        images: (data.images ?? []) as string[],
        cover_image: (data.cover_image ?? null) as string | null,
      };
    } catch (err) {
      // Fall back to static data if API fails or item not found in DB
      const item = newsItems.find((n) => n.id === id);
      if (!item) throw notFound();
      return {
        _source: "static" as const,
        ...item,
        layout: (item.layout ?? "classic") as "classic" | "hero-image" | "split" | "magazine",
        images: (item.images ?? []) as string[],
        cover_image: (item.image ?? null) as string | null,
      };
    }
  },
  head: ({ loaderData }: { loaderData: any }) => ({
    meta: [{ title: `${loaderData?.title} — ECAN News` }],
  }),
});

// ── Shared helpers ────────────────────────────────────────────────────────────
type ArticleData = any;

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  announcement: Megaphone,
  policy: FileText,
  event: PartyPopper,
  partnership: Handshake,
  award: Award,
};
const CATEGORY_GRADIENT: Record<string, string> = {
  announcement: "from-blue-600 to-blue-800",
  policy: "from-violet-600 to-violet-800",
  event: "from-amber-500 to-amber-700",
  partnership: "from-emerald-600 to-emerald-800",
  award: "from-rose-600 to-rose-800",
};
const CATEGORY_BADGE: Record<string, string> = {
  announcement: "bg-blue-50 text-blue-700 border-blue-200",
  policy: "bg-violet-50 text-violet-700 border-violet-200",
  event: "bg-amber-50 text-amber-700 border-amber-200",
  partnership: "bg-emerald-50 text-emerald-700 border-emerald-200",
  award: "bg-rose-50 text-rose-700 border-rose-200",
};

function formatDate(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ArticleBody({ content }: { content: string }) {
  if (!content) return null;
  return (
    <div className="prose max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

function CategoryBadge({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[category] || Megaphone;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-label px-3 py-1.5 rounded-full border ${CATEGORY_BADGE[category] || CATEGORY_BADGE.announcement} ${className}`}
    >
      <Icon className="h-3 w-3" /> {category}
    </span>
  );
}

function AuthorCard({
  author,
  date,
  gradient,
}: {
  author: string;
  date: string;
  gradient: string;
}) {
  const initials = (author || "EA")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex items-center gap-3">
      <div
        className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}
      >
        {initials}
      </div>
      <div>
        <p className="text-body-sm font-semibold text-[var(--navy)]">{author || "ECAN Secretariat"}</p>
        <p className="text-caption text-[var(--slate)]">{formatDate(date)}</p>
      </div>
    </div>
  );
}

// ── Sidebar (shared across layouts) ──────────────────────────────────────────
function Sidebar({ article }: { article: ArticleData }) {
  const gradient = CATEGORY_GRADIENT[article.category] || CATEGORY_GRADIENT.announcement;
  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6">
        <p className="text-label text-[var(--slate)] mb-4">
          Published by
        </p>
        <AuthorCard author={article.author} date={article.date} gradient={gradient} />
      </div>

      <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white`}>
        <p className="text-label text-white/60 mb-2">
          Stay Informed
        </p>
        <p className="text-body-sm text-white/80 mb-4">
          Get the latest ECAN news and updates delivered to your inbox.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2 text-label text-white transition-colors w-full"
        >
          Subscribe to Updates
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6">
        <p className="text-label text-[var(--slate)] mb-3">
          Share
        </p>
        <button className="inline-flex items-center gap-2 text-body-sm text-[var(--slate)] hover:text-[var(--navy)] transition-colors">
          <Share2 size={15} /> Share this article
        </button>
      </div>
    </aside>
  );
}

// ── LAYOUT 1: Classic ─────────────────────────────────────────────────────────
// Clean editorial — no images, pure typography focus
function LayoutClassic({ article }: { article: ArticleData }) {
  const gradient = CATEGORY_GRADIENT[article.category] || CATEGORY_GRADIENT.announcement;
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="container-page relative py-16 md:py-24">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={15} /> Back to News
          </Link>
          <CategoryBadge
            category={article.category}
            className="bg-white/15 text-white border-white/20 mb-5"
          />
          <h1 className="text-hero text-white max-w-3xl mt-4">
            {article.title}
          </h1>
          <p className="mt-5 text-white/70 text-body max-w-2xl">{article.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-5 text-caption text-label text-white/60">
            <span className="flex items-center gap-1.5">
              <User size={14} /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(article.date)}
            </span>
          </div>
        </div>
      </div>

      <div className="container-page py-12 grid lg:grid-cols-[1fr_300px] gap-10 items-start">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-8 md:p-12"
        >
          <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${gradient} mb-8`} />
          <ArticleBody content={article.content} />
          <div className="mt-10 pt-8 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-4">
            <CategoryBadge category={article.category} />
            <button className="inline-flex items-center gap-2 text-sm text-[var(--slate)] hover:text-[var(--navy)] transition-colors">
              <Share2 size={15} /> Share
            </button>
          </div>
        </motion.article>
        <Sidebar article={article} />
      </div>
    </div>
  );
}

// ── LAYOUT 2: Hero Image ──────────────────────────────────────────────────────
// Full-width cinematic cover photo, content below
function LayoutHeroImage({ article }: { article: ArticleData }) {
  const gradient = CATEGORY_GRADIENT[article.category] || CATEGORY_GRADIENT.announcement;
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Full-width hero image */}
      <div className="relative h-[55vh] min-h-[400px] bg-[var(--navy)] overflow-hidden">
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="absolute top-6 left-0 right-0 container-page">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} /> Back to News
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 container-page pb-10">
          <CategoryBadge
            category={article.category}
            className="bg-white/15 text-white border-white/20 mb-4"
          />
          <h1 className="text-hero text-white max-w-3xl">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-caption text-label text-white/60">
            <span className="flex items-center gap-1.5">
              <User size={14} /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(article.date)}
            </span>
          </div>
        </div>
      </div>

      <div className="container-page py-12 grid lg:grid-cols-[1fr_300px] gap-10 items-start">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-8 md:p-12"
        >
          <p className="text-lg text-[var(--slate)] leading-relaxed border-l-4 border-[var(--crimson)] pl-5 mb-8 italic">
            {article.excerpt}
          </p>
          <ArticleBody content={article.content} />

          {/* Extra images grid */}
          {article.images && article.images.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-3">
              {article.images.map((src: string, i: number) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-video bg-[var(--muted)]">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-4">
            <CategoryBadge category={article.category} />
            <button className="inline-flex items-center gap-2 text-sm text-[var(--slate)] hover:text-[var(--navy)] transition-colors">
              <Share2 size={15} /> Share
            </button>
          </div>
        </motion.article>
        <Sidebar article={article} />
      </div>
    </div>
  );
}

// ── LAYOUT 3: Split ───────────────────────────────────────────────────────────
// Image on the left, content on the right — editorial magazine feel
function LayoutSplit({ article }: { article: ArticleData }) {
  const gradient = CATEGORY_GRADIENT[article.category] || CATEGORY_GRADIENT.announcement;
  const initials = (article.author || "EA")
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Slim nav bar */}
      <div className={`bg-gradient-to-r ${gradient} py-4`}>
        <div className="container-page">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} /> Back to News
          </Link>
        </div>
      </div>

      {/* Split hero */}
      <div className="grid lg:grid-cols-2 min-h-[480px]">
        {/* Image panel */}
        <div className={`relative bg-gradient-to-br ${gradient} overflow-hidden`}>
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/50" />
          <div className="relative h-full flex flex-col justify-end p-10 md:p-14">
            <CategoryBadge
              category={article.category}
              className="bg-white/15 text-white border-white/20 mb-5 self-start"
            />
            <div className={`h-1 w-12 rounded-full bg-[var(--gold)] mb-5`} />
            <p className="text-white/60 text-sm flex items-center gap-2">
              <Calendar size={13} /> {formatDate(article.date)}
            </p>
          </div>
        </div>

        {/* Title panel */}
        <div className="bg-white flex flex-col justify-center p-10 md:p-14">
          <h1 className="text-hero text-[var(--navy)]">
            {article.title}
          </h1>
          <p className="mt-5 text-[var(--slate)] text-body">{article.excerpt}</p>
          <div className="mt-6 flex items-center gap-3">
            <div
              className={`h-9 w-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs shrink-0`}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--navy)]">{article.author || "ECAN Secretariat"}</p>
              <p className="text-xs text-[var(--slate)]">ECAN Editorial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-page py-12 grid lg:grid-cols-[1fr_300px] gap-10 items-start">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-8 md:p-12"
        >
          <ArticleBody content={article.content} />

          {article.images && article.images.length > 0 && (
            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-widest text-[var(--slate)] font-semibold mb-4">
                Photo Gallery
              </p>
              <div className="grid grid-cols-3 gap-3">
                {article.images.map((src: string, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden aspect-square bg-[var(--muted)]"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-4">
            <CategoryBadge category={article.category} />
            <button className="inline-flex items-center gap-2 text-sm text-[var(--slate)] hover:text-[var(--navy)] transition-colors">
              <Share2 size={15} /> Share
            </button>
          </div>
        </motion.article>
        <Sidebar article={article} />
      </div>
    </div>
  );
}

// ── LAYOUT 4: Magazine ────────────────────────────────────────────────────────
// Rich multi-image layout — images woven into the article body
function LayoutMagazine({ article }: { article: ArticleData }) {
  const gradient = CATEGORY_GRADIENT[article.category] || CATEGORY_GRADIENT.announcement;
  const allImages = [article.cover_image, ...(article.images || [])].filter(Boolean) as string[];
  const paragraphs = (article.content || "").split(/\n+/).filter(Boolean);

  // Weave images between paragraphs
  const woven: Array<{ type: "text"; text: string } | { type: "image"; src: string }> = [];
  let imgIdx = 0;
  paragraphs.forEach((p: string, i: number) => {
    woven.push({ type: "text", text: p });
    // Insert an image after every 3rd paragraph if images remain
    if ((i + 1) % 3 === 0 && imgIdx < allImages.length) {
      woven.push({ type: "image", src: allImages[imgIdx++] });
    }
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Masthead */}
      <div className="bg-[var(--navy)] border-b border-white/10">
        <div className="container-page py-4 flex items-center justify-between">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} /> News
          </Link>
          <CategoryBadge
            category={article.category}
            className="bg-white/10 text-white border-white/20"
          />
        </div>
      </div>

      {/* Cover */}
      {allImages[0] && (
        <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <img src={allImages[0]} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/70 to-transparent" />
        </div>
      )}

      {/* Title block */}
      <div className={`bg-gradient-to-r ${gradient}`}>
        <div className="container-page py-10 max-w-4xl">
          <h1 className="text-hero text-white">
            {article.title}
          </h1>
          <p className="mt-4 text-white/70 text-body max-w-2xl">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-caption text-label text-white/60">
            <span className="flex items-center gap-1.5">
              <User size={14} /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(article.date)}
            </span>
          </div>
        </div>
      </div>

      {/* Body with woven images */}
      <div className="container-page py-12 grid lg:grid-cols-[1fr_300px] gap-10 items-start">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-8 md:p-12"
        >
          <div className="prose max-w-none">
            {woven.map((block, i) =>
              block.type === "text" ? (
                <ReactMarkdown key={i}>{block.text}</ReactMarkdown>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl overflow-hidden aspect-video bg-[var(--muted)] my-4 shadow-md"
                >
                  <img src={block.src} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ),
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-4">
            <CategoryBadge category={article.category} />
            <button className="inline-flex items-center gap-2 text-sm text-[var(--slate)] hover:text-[var(--navy)] transition-colors">
              <Share2 size={15} /> Share
            </button>
          </div>
        </motion.article>
        <Sidebar article={article} />
      </div>
    </div>
  );
}

// ── Prev / Next nav ───────────────────────────────────────────────────────────
function PrevNext({ article }: { article: ArticleData }) {
  if (article._source !== "static") return null;
  const idx = newsItems.findIndex((n) => n.id === article.id);
  const prev = newsItems[idx + 1] ?? null;
  const next = newsItems[idx - 1] ?? null;
  if (!prev && !next) return null;

  return (
    <div className="container-page pb-16">
      <div className="grid sm:grid-cols-2 gap-4">
        {prev ? (
          <Link
            to="/news/$id"
            params={{ id: prev.id }}
            className="group flex items-center gap-4 bg-white rounded-2xl border border-[var(--border)] p-5 hover:border-[var(--crimson)] hover:shadow-md transition-all"
          >
            <ArrowLeft
              size={18}
              className="text-[var(--slate)] group-hover:text-[var(--crimson)] shrink-0 transition-colors"
            />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[var(--slate)] mb-1">
                Previous
              </p>
              <p className="text-sm font-semibold text-[var(--navy)] group-hover:text-[var(--crimson)] transition-colors truncate">
                {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link
            to="/news/$id"
            params={{ id: next.id }}
            className="group flex items-center justify-end gap-4 bg-white rounded-2xl border border-[var(--border)] p-5 hover:border-[var(--crimson)] hover:shadow-md transition-all text-right"
          >
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[var(--slate)] mb-1">Next</p>
              <p className="text-sm font-semibold text-[var(--navy)] group-hover:text-[var(--crimson)] transition-colors truncate">
                {next.title}
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-[var(--slate)] group-hover:text-[var(--crimson)] shrink-0 transition-colors"
            />
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function NewsDetailPage() {
  const article = Route.useLoaderData();

  return (
    <>
      {article.layout === "hero-image" && <LayoutHeroImage article={article} />}
      {article.layout === "split" && <LayoutSplit article={article} />}
      {article.layout === "magazine" && <LayoutMagazine article={article} />}
      {(article.layout === "classic" || !article.layout) && <LayoutClassic article={article} />}
      <PrevNext article={article} />
    </>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Share2,
  BookOpen,
  MapPin,
  CreditCard,
  GraduationCap,
  Briefcase,
  Lightbulb,
} from "lucide-react";
import { blogPosts } from "@/data/news";
import type { BlogPost } from "@/lib/types";

export const Route = createFileRoute("/blog_/$id")({
  component: BlogDetailPage,
  loader: async ({ params }: { params: { id: string } }) => {
    const { id } = params;

    try {
      const res = await fetch(`/api/blogs/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      return {
        _source: "db" as const,
        ...data,
        layout: (data.layout ?? "classic") as BlogPost["layout"],
        images: (data.images ?? []) as string[],
        cover_image: (data.cover_image ?? null) as string | null,
      } as BlogPost & { _source: "db" };
    } catch (err) {
      // Static fallback if API fails
      const post = blogPosts.find((b) => b.id === id);
      if (!post) throw notFound();
      return {
        _source: "static" as const,
        ...post,
        layout: (post.layout ?? "classic") as BlogPost["layout"],
        images: (post.images ?? []) as string[],
        cover_image: (post.image ?? null) as string | null,
      } as BlogPost & { _source: "static" };
    }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${(loaderData as BlogPost)?.title} — ECAN Blog` }],
  }),
});

type ArticleData = BlogPost & { _source: "db" | "static" };

// ── Shared maps ───────────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  guide: BookOpen,
  destination: MapPin,
  visa: CreditCard,
  scholarship: GraduationCap,
  career: Briefcase,
  tips: Lightbulb,
};
const CATEGORY_GRADIENT: Record<string, string> = {
  guide: "from-blue-600 to-blue-800",
  destination: "from-emerald-600 to-emerald-800",
  visa: "from-violet-600 to-violet-800",
  scholarship: "from-amber-500 to-amber-700",
  career: "from-rose-600 to-rose-800",
  tips: "from-cyan-600 to-cyan-800",
};
const CATEGORY_BADGE: Record<string, string> = {
  guide: "bg-blue-50 text-blue-700 border-blue-200",
  destination: "bg-emerald-50 text-emerald-700 border-emerald-200",
  visa: "bg-violet-50 text-violet-700 border-violet-200",
  scholarship: "bg-amber-50 text-amber-700 border-amber-200",
  career: "bg-rose-50 text-rose-700 border-rose-200",
  tips: "bg-cyan-50 text-cyan-700 border-cyan-200",
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

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ article }: { article: ArticleData }) {
  const gradient = CATEGORY_GRADIENT[article.category] || CATEGORY_GRADIENT.guide;
  const initials = article.author
    ? article.author
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
    : "EA";
  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
      {/* Author */}
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6">
        <p className="text-label text-[var(--slate)] mb-4">
          Written by
        </p>
        <div className="flex items-center gap-3">
          <div
            className={`h-11 w-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}
          >
            {initials}
          </div>
          <div>
            <p className="text-body-sm font-semibold text-[var(--navy)]">{article.author}</p>
            <p className="text-caption text-[var(--slate)]">{formatDate(article.date)}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-heading text-[var(--navy)]">{article.readTime}</p>
          <p className="text-label text-[var(--slate)] mt-1">Min read</p>
        </div>
        <div className="text-center">
          <p className="text-heading text-[var(--navy)]">
            {(article.content || "").split(" ").length}
          </p>
          <p className="text-label text-[var(--slate)] mt-1">Words</p>
        </div>
      </div>

      {/* CTA */}
      <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white`}>
        <p className="text-label text-white/70 mb-2">
          Need guidance?
        </p>
        <p className="text-body-sm text-white/90 mb-4 leading-relaxed">
          Connect with an ECAN-registered consultancy for personalised advice.
        </p>
        <Link
          to="/members"
          className="inline-flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2 text-label text-white transition-colors w-full"
        >
          Find a Consultancy
        </Link>
      </div>

      {/* Share */}
      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6">
        <p className="text-label text-[var(--slate)] mb-3">
          Share
        </p>
        <button className="text-body-sm inline-flex items-center gap-2 text-[var(--slate)] hover:text-[var(--navy)] transition-colors">
          <Share2 size={15} /> Share this article
        </button>
      </div>
    </aside>
  );
}

// ── LAYOUT 1: Classic ─────────────────────────────────────────────────────────
function LayoutClassic({ article }: { article: ArticleData }) {
  const gradient = CATEGORY_GRADIENT[article.category] || CATEGORY_GRADIENT.guide;
  const Icon = CATEGORY_ICONS[article.category] || BookOpen;
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className={`bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-0 h-full flex items-center pr-12 opacity-[0.06] pointer-events-none">
          <Icon className="h-72 w-72" strokeWidth={0.5} />
        </div>
        <div className="container-page relative py-16 md:py-24">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Blog
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 bg-white/15 text-white text-label px-3 py-1.5 rounded-full border border-white/20 mb-5`}
          >
            <Icon className="h-3 w-3" /> {article.category}
          </span>
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
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {article.readTime} min read
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
          <div className={`mt-10 rounded-xl bg-gradient-to-br ${gradient} p-6 text-white`}>
            <p className="text-label font-bold mb-2 text-white/70">
              Key Takeaway
            </p>
            <p className="text-body-sm text-white/90">{article.excerpt}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-4">
            <span
              className={`inline-flex items-center gap-1.5 text-label px-3 py-1.5 rounded-full border ${CATEGORY_BADGE[article.category] || CATEGORY_BADGE.guide}`}
            >
              <Icon className="h-3 w-3" /> {article.category}
            </span>
            <button className="text-body-sm inline-flex items-center gap-2 text-[var(--slate)] hover:text-[var(--navy)] transition-colors">
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
function LayoutHeroImage({ article }: { article: ArticleData }) {
  const gradient = CATEGORY_GRADIENT[article.category] || CATEGORY_GRADIENT.guide;
  const Icon = CATEGORY_ICONS[article.category] || BookOpen;
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="relative h-[55vh] min-h-[400px] bg-[var(--navy)] overflow-hidden">
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <Icon className="absolute inset-0 m-auto h-40 w-40 text-white/10" strokeWidth={0.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute top-6 left-0 right-0 container-page">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} /> Back to Blog
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 container-page pb-10">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-label px-3 py-1.5 rounded-full border border-white/20 mb-4">
            <Icon className="h-3 w-3" /> {article.category}
          </span>
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
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {article.readTime} min read
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
          {article.images && article.images.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-3">
              {article.images.map((src: string, i: number) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-video bg-[var(--muted)]">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className={`mt-10 rounded-xl bg-gradient-to-br ${gradient} p-6 text-white`}>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-white/70">
              Key Takeaway
            </p>
            <p className="text-sm leading-relaxed text-white/90">{article.excerpt}</p>
          </div>
        </motion.article>
        <Sidebar article={article} />
      </div>
    </div>
  );
}

// ── LAYOUT 3: Split ───────────────────────────────────────────────────────────
function LayoutSplit({ article }: { article: ArticleData }) {
  const gradient = CATEGORY_GRADIENT[article.category] || CATEGORY_GRADIENT.guide;
  const Icon = CATEGORY_ICONS[article.category] || BookOpen;
  const initials = (article.author || "EA")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className={`bg-gradient-to-r ${gradient} py-4`}>
        <div className="container-page">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} /> Back to Blog
          </Link>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 min-h-[480px]">
        <div className={`relative bg-gradient-to-br ${gradient} overflow-hidden`}>
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
            />
          ) : (
            <Icon className="absolute inset-0 m-auto h-40 w-40 text-white/10" strokeWidth={0.5} />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/50" />
          <div className="relative h-full flex flex-col justify-end p-10 md:p-14">
            <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-label px-3 py-1.5 rounded-full border border-white/20 mb-5 self-start">
              <Icon className="h-3 w-3" /> {article.category}
            </span>
            <div className="h-1 w-12 rounded-full bg-[var(--gold)] mb-5" />
            <p className="text-white/60 text-caption flex items-center gap-2">
              <Calendar size={13} /> {formatDate(article.date)}
            </p>
            <p className="text-white/60 text-caption flex items-center gap-2 mt-1">
              <Clock size={13} /> {article.readTime} min read
            </p>
          </div>
        </div>
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
              <p className="text-sm font-semibold text-[var(--navy)]">{article.author || "ECAN Editorial"}</p>
              <p className="text-xs text-[var(--slate)]">ECAN Blog</p>
            </div>
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
          <div className={`mt-10 rounded-xl bg-gradient-to-br ${gradient} p-6 text-white`}>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-white/70">
              Key Takeaway
            </p>
            <p className="text-sm leading-relaxed text-white/90">{article.excerpt}</p>
          </div>
        </motion.article>
        <Sidebar article={article} />
      </div>
    </div>
  );
}

// ── LAYOUT 4: Magazine ────────────────────────────────────────────────────────
function LayoutMagazine({ article }: { article: ArticleData }) {
  const gradient = CATEGORY_GRADIENT[article.category] || CATEGORY_GRADIENT.guide;
  const Icon = CATEGORY_ICONS[article.category] || BookOpen;
  const allImages = [article.cover_image, ...(article.images ?? [])].filter(Boolean) as string[];
  const paragraphs = (article.content || "").split(/\n+/).filter(Boolean);
  const woven: Array<{ type: "text"; text: string } | { type: "image"; src: string }> = [];
  let imgIdx = 0;
  paragraphs.forEach((p: string, i: number) => {
    woven.push({ type: "text", text: p });
    if ((i + 1) % 3 === 0 && imgIdx < allImages.length) {
      woven.push({ type: "image", src: allImages[imgIdx++] });
    }
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="bg-[var(--navy)] border-b border-white/10">
        <div className="container-page py-4 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} /> Blog
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 text-label px-3 py-1.5 rounded-full border ${CATEGORY_BADGE[article.category] || CATEGORY_BADGE.guide}`}
          >            <Icon className="h-3 w-3" /> {article.category}
          </span>
        </div>
      </div>
      {allImages[0] && (
        <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <img src={allImages[0]} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/70 to-transparent" />
        </div>
      )}
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
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {article.readTime} min read
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
          <div className={`mt-10 rounded-xl bg-gradient-to-br ${gradient} p-6 text-white`}>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-2 text-white/70">
              Key Takeaway
            </p>
            <p className="text-sm leading-relaxed text-white/90">{article.excerpt}</p>
          </div>
        </motion.article>
        <Sidebar article={article} />
      </div>
    </div>
  );
}

// ── Prev / Next ───────────────────────────────────────────────────────────────
function PrevNext({ article }: { article: ArticleData }) {
  if (article._source !== "static") return null;
  const idx = blogPosts.findIndex((b) => b.id === article.id);
  const prev = blogPosts[idx + 1] ?? null;
  const next = blogPosts[idx - 1] ?? null;
  if (!prev && !next) return null;
  return (
    <div className="container-page pb-16">
      <div className="grid sm:grid-cols-2 gap-4">
        {prev ? (
          <Link
            to="/blog/$id"
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
            to="/blog/$id"
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
function BlogDetailPage() {
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

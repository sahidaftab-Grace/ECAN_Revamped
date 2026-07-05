import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/site/PageHeader";
import {
  ShieldCheck,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  History,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import president from "@/assets/1_-_President_-_Laxman_Andrew_Poudel.jpeg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — ECAN" },
      {
        name: "description",
        content:
          "ECAN is the national association of Nepal's educational consultancies, registered in 1997 — guiding students, supporting parents and shaping policy.",
      },
    ],
  }),
});

type AboutStat = {
  value: string;
  label: string;
  color?: string;
};

type AboutValue = {
  title: string;
  body: string;
  icon?: string;
};

type AboutMilestone = {
  year: string;
  text: string;
};

type AboutContent = {
  hero_eyebrow: string;
  hero_title: string;
  hero_highlighted_text: string;
  hero_intro: string;
  identity_eyebrow: string;
  identity_title: string;
  identity_highlighted_text: string;
  identity_intro: string;
  identity_body: string;
  identity_image: string;
  stats: AboutStat[];
  values_eyebrow: string;
  values_title: string;
  values_highlighted_text: string;
  values_intro: string;
  values: AboutValue[];
  timeline_eyebrow: string;
  timeline_title: string;
  timeline_highlighted_text: string;
  timeline_intro: string;
  milestones: AboutMilestone[];
  cta_title: string;
  cta_intro: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
};

const defaultAboutContent: AboutContent = {
  hero_eyebrow: "The ECAN Heritage",
  hero_title: "A Vision for Students, A Tool for the Nation.",
  hero_highlighted_text: "A Tool for the Nation.",
  hero_intro:
    "ECAN is more than an association; it is a promise of integrity to students, parents, and education providers worldwide since 1997.",
  identity_eyebrow: "Our Core Identity",
  identity_title: "Nepal's Authoritative Voice in International Education.",
  identity_highlighted_text: "International Education.",
  identity_intro:
    "Every year, thousands of young Nepalis leave home in pursuit of global opportunities. Behind every journey lies a dream, a family's trust, and a nation's future.",
  identity_body:
    "We are committed to ensuring that this journey is guided by transparency, accountability, and student-centered protection. Our vision is clear: to create an international education ecosystem where opportunity and security go hand in hand, empowering our youth to achieve their ambitions with confidence and peace of mind.",
  identity_image: "",
  stats: [
    { value: "27+", label: "Years of Service", color: "navy" },
    { value: "600+", label: "Member Agencies", color: "primary" },
  ],
  values_eyebrow: "Guiding Principles",
  values_title: "The Values that Define Us.",
  values_highlighted_text: "Define Us.",
  values_intro:
    "Our commitment to ethical guidance ensures that every student's journey is handled with the highest standard of professionalism.",
  values: [
    { title: "Integrity", body: "Honest counsel before commercial interest, every time.", icon: "award" },
    { title: "Stewardship", body: "Monitoring members so the sector keeps its standards high.", icon: "shield-check" },
    { title: "Advocacy", body: "Speaking for Nepali students in policy rooms at home and abroad.", icon: "trending-up" },
    { title: "Care", body: "Treating every student's journey as a family decision.", icon: "check-circle" },
  ],
  timeline_eyebrow: "Historical Timeline",
  timeline_title: "Twenty-Seven Years of Impactful Moments.",
  timeline_highlighted_text: "Impactful Moments.",
  timeline_intro: "Evolving from a local group to the national authority for educational consultancies.",
  milestones: [
    { year: "1997", text: "Founded under the Chief District Administration Office, Kathmandu." },
    { year: "2005", text: "Recognized by overseas education providers as Nepal's representative body." },
    { year: "2018", text: "Launch of the ECAN mobile app for verified member discovery." },
    { year: "2024", text: "A renewed focus on transparent, accountable, and student-centered global education guidance." },
  ],
  cta_title: "Join the National Network",
  cta_intro:
    "If you are a consultancy committed to ethics and professional standards, become a part of Nepal's largest educational association.",
  primary_cta_label: "Apply for Membership",
  primary_cta_url: "/contact",
  secondary_cta_label: "View Member Directory",
  secondary_cta_url: "/members",
};

const valueStyles: Record<string, { Icon: LucideIcon; color: string; bg: string }> = {
  award: { Icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
  "shield-check": { Icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
  "trending-up": { Icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  "check-circle": { Icon: CheckCircle2, color: "text-rose-500", bg: "bg-rose-500/10" },
};

function highlightText(text: string, highlighted: string) {
  if (!highlighted || !text.includes(highlighted)) return text;
  const [before, after] = text.split(highlighted);
  return (
    <>
      {before}
      <span className="text-[var(--primary)]">{highlighted}</span>
      {after}
    </>
  );
}

function AboutPage() {
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);

  useEffect(() => {
    let mounted = true;

    fetch("/api/home-content/about-page")
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!mounted || !payload?.data) return;
        setContent({
          ...defaultAboutContent,
          ...payload.data,
          stats: Array.isArray(payload.data.stats) ? payload.data.stats : defaultAboutContent.stats,
          values: Array.isArray(payload.data.values) ? payload.data.values : defaultAboutContent.values,
          milestones: Array.isArray(payload.data.milestones) ? payload.data.milestones : defaultAboutContent.milestones,
        });
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const identityImage = content.identity_image || president;
  const stats = content.stats.slice(0, 2);
  const values = content.values.slice(0, 4);
  const milestones = content.milestones.slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow={content.hero_eyebrow}
        title={
          <>
            {highlightText(content.hero_title, content.hero_highlighted_text)}
          </>
        }
        intro={content.hero_intro}
      />

      <section className="container-page py-24 md:py-32 grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 relative"
        >
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
            <img
              src={identityImage}
              alt="ECAN leadership"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/60 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-full h-full border-2 border-slate-100 rounded-[2.5rem] -z-0" />
          <div className="absolute -top-10 -left-10 h-40 w-40 bg-[var(--primary)]/10 blur-3xl" />
        </motion.div>

        <div className="lg:col-span-6 lg:col-start-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="eyebrow inline-flex items-center gap-2">
              <span className="h-px w-8 bg-[var(--primary)]" />
              {content.identity_eyebrow}
            </p>
            <h2 className="mt-6 text-heading text-[var(--navy)] leading-tight font-display">
              {highlightText(content.identity_title, content.identity_highlighted_text)}
            </h2>
            <p className="mt-8 text-lg text-[var(--slate)] font-medium leading-relaxed">
              {content.identity_intro}
            </p>
            <p className="mt-4 text-body text-[var(--slate)] leading-relaxed">
              {content.identity_body}
            </p>
            <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`}>
                  <p className={`text-3xl font-bold font-display ${stat.color === "primary" ? "text-[var(--primary)]" : "text-[var(--navy)]"}`}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-bold text-[var(--slate)] uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[var(--navy)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy)] via-[var(--navy)]/95 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/10 blur-[100px] rounded-full -mr-48 -mt-48" />

        <div className="container-page py-24 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4">
              <p className="text-[var(--gold)] text-label flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {content.values_eyebrow}
              </p>
              <h2 className="mt-6 text-heading leading-tight font-display">
                {highlightText(content.values_title, content.values_highlighted_text)}
              </h2>
              <p className="mt-6 text-white/50 text-lg font-medium leading-relaxed">
                {content.values_intro}
              </p>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const style = valueStyles[value.icon || "award"] || valueStyles.award;
                const Icon = style.Icon;

                return (
                  <motion.div
                    key={`${value.title}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 hover:bg-white/10 transition-all group"
                  >
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${style.bg} ${style.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold font-display">{value.title}</h3>
                    <p className="mt-4 text-[15px] text-white/60 font-medium leading-relaxed">{value.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="eyebrow inline-flex items-center gap-2">
              <History className="h-4 w-4 text-[var(--primary)]" />
              {content.timeline_eyebrow}
            </p>
            <h2 className="mt-6 text-heading text-[var(--navy)] leading-tight font-display">
              {highlightText(content.timeline_title, content.timeline_highlighted_text)}
            </h2>
          </div>
          <p className="text-[var(--slate)] text-lg font-medium max-w-sm">
            {content.timeline_intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {milestones.map((milestone, index) => (
            <motion.div
              key={`${milestone.year}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-slate-100 rounded-3xl p-10 flex gap-8 hover:border-[var(--primary)]/30 hover:shadow-2xl hover:shadow-[var(--primary)]/5 transition-all group"
            >
              <span className="text-4xl font-black text-slate-100 group-hover:text-[var(--primary)]/20 transition-colors tabular-nums font-display">
                {milestone.year}
              </span>
              <div className="flex-1">
                <div className="h-1 w-8 bg-[var(--primary)]/20 rounded-full mb-6 group-hover:w-16 group-hover:bg-[var(--primary)] transition-all duration-500" />
                <p className="text-lg text-[var(--navy)] font-bold leading-relaxed">{milestone.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 rounded-[3rem] bg-slate-50 border border-slate-100 p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-[var(--navy)] font-display">{content.cta_title}</h2>
          <p className="mt-4 text-[var(--slate)] font-medium text-lg max-w-2xl mx-auto">
            {content.cta_intro}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-14 rounded-2xl px-8 shadow-xl shadow-[var(--primary)]/20">
              <Link to={content.primary_cta_url || "/contact"}>
                {content.primary_cta_label}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="h-14 rounded-2xl px-8 border-2">
              <Link to={content.secondary_cta_url || "/members"}>
                {content.secondary_cta_label}
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}

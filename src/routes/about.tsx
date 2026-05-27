import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/site/PageHeader";
import { ShieldCheck, Award, TrendingUp, CheckCircle2, ArrowRight, History, Sparkles } from "lucide-react";
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

const milestones = [
  { y: "1997", t: "Founded under the Chief District Administration Office, Kathmandu." },
  { y: "2005", t: "Recognized by overseas education providers as Nepal's representative body." },
  { y: "2018", t: "Launch of the ECAN mobile app for verified member discovery." },
  { y: "2024", t: "Smart ECAN 2.0 — security-first guidance for students and parents." },
];

const values = [
  { t: "Integrity", d: "Honest counsel before commercial interest, every time.", Icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
  { t: "Stewardship", d: "Monitoring members so the sector keeps its standards high.", Icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
  { t: "Advocacy", d: "Speaking for Nepali students in policy rooms at home and abroad.", Icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { t: "Care", d: "Treating every student's journey as a family decision.", Icon: CheckCircle2, color: "text-rose-500", bg: "bg-rose-500/10" },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="The ECAN Heritage"
        title={
          <>
            A Vision for Students, <br />
            <span className="text-[var(--gold)]">A Tool for the Nation.</span>
          </>
        }
        intro="ECAN is more than an association; it is a promise of integrity to students, parents, and education providers worldwide since 1997."
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
              src={president}
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
              Our Core Identity
            </p>
            <h2 className="mt-6 text-heading text-[var(--navy)] leading-tight font-display">
              Nepal's Authoritative Voice in <span className="text-[var(--primary)]">International Education.</span>
            </h2>
            <p className="mt-8 text-lg text-[var(--slate)] font-medium leading-relaxed">
              Educational Consultancy Association of Nepal — registered in 1997 — was founded
              to bring proper information and guidance to parents interested in sending their children
              for studies abroad.
            </p>
            <p className="mt-4 text-body text-[var(--slate)] leading-relaxed">
              Today, ECAN is endorsed by educationalists across the country and instantly recognized
              by overseas education providers. We control and monitor member activities, 
              nurturing a secure and ethical environment for global learning.
            </p>
            <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-bold text-[var(--navy)] font-display">27+</p>
                <p className="text-sm font-bold text-[var(--slate)] uppercase tracking-wider mt-1">Years of Service</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--primary)] font-display">600+</p>
                <p className="text-sm font-bold text-[var(--slate)] uppercase tracking-wider mt-1">Member Agencies</p>
              </div>
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
                Guiding Principles
              </p>
              <h2 className="mt-6 text-heading leading-tight font-display">
                The Values that <br /> <span className="text-[var(--gold)]">Define Us.</span>
              </h2>
              <p className="mt-6 text-white/50 text-lg font-medium leading-relaxed">
                Our commitment to ethical guidance ensures that every student's journey is 
                handled with the highest standard of professionalism.
              </p>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.t}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-10 hover:bg-white/10 transition-all group"
                >
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${v.bg} ${v.color}`}>
                    <v.Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-display">{v.t}</h3>
                  <p className="mt-4 text-[15px] text-white/60 font-medium leading-relaxed">{v.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="eyebrow inline-flex items-center gap-2">
              <History className="h-4 w-4 text-[var(--primary)]" />
              Historical Timeline
            </p>
            <h2 className="mt-6 text-heading text-[var(--navy)] leading-tight font-display">
              Twenty-Seven Years of <br /> <span className="text-[var(--primary)]">Impactful Moments.</span>
            </h2>
          </div>
          <p className="text-[var(--slate)] text-lg font-medium max-w-sm">
            Evolving from a local group to the national authority for educational consultancies.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {milestones.map((m, i) => (
            <motion.div
              key={m.y}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-100 rounded-3xl p-10 flex gap-8 hover:border-[var(--primary)]/30 hover:shadow-2xl hover:shadow-[var(--primary)]/5 transition-all group"
            >
              <span className="text-4xl font-black text-slate-100 group-hover:text-[var(--primary)]/20 transition-colors tabular-nums font-display">
                {m.y}
              </span>
              <div className="flex-1">
                <div className="h-1 w-8 bg-[var(--primary)]/20 rounded-full mb-6 group-hover:w-16 group-hover:bg-[var(--primary)] transition-all duration-500" />
                <p className="text-lg text-[var(--navy)] font-bold leading-relaxed">{m.t}</p>
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
          <h2 className="text-3xl font-bold text-[var(--navy)] font-display">Join the National Network</h2>
          <p className="mt-4 text-[var(--slate)] font-medium text-lg max-w-2xl mx-auto">
            If you are a consultancy committed to ethics and professional standards, 
            become a part of Nepal's largest educational association.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="h-14 rounded-2xl px-8 shadow-xl shadow-[var(--primary)]/20">
              <Link to="/contact">
                Apply for Membership
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="h-14 rounded-2xl px-8 border-2">
              <Link to="/members">
                View Member Directory
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}

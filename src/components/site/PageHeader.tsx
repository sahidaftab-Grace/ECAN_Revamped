import { motion } from "framer-motion";
import himalaya from "@/assets/himalaya-mist.jpg";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <header className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-[var(--navy)]">
      {/* Background image with parallax-like feel */}
      <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src={himalaya}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/90 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--primary)]/5 to-transparent pointer-events-none" />
      
      {/* Brand bottom accent line */}
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--gold)] to-transparent origin-left" 
      />

      <div className="container-page relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow text-[var(--gold)] flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--gold)]/50" />
            {eyebrow}
          </p>
          <h1 className="mt-6 text-hero text-white max-w-4xl leading-[1.1] font-display">
            {title}
          </h1>
          {intro && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 max-w-2xl text-lg md:text-xl font-medium text-white/60 leading-relaxed"
            >
              {intro}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-[var(--gold)]/10 blur-[100px] rounded-full" />
    </header>
  );
}


import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo.png";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <img src={logoImg} alt="ECAN Logo" className="h-10 w-auto object-contain" />
      <span className="flex flex-col leading-tight">
        <span
          className={`font-bold text-base tracking-wide ${light ? "text-white" : "text-[var(--navy)]"}`}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          ECAN
        </span>
        <span
          className={`text-[9px] tracking-[0.16em] uppercase font-medium ${light ? "text-white/70" : "text-[var(--slate)]"}`}
        >
          Nepal · Est. 1997
        </span>
      </span>
    </Link>
  );
}

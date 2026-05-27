import { Outlet, Link, createRootRoute, useRouterState } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

function NotFoundComponent() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[70vh] items-center justify-center bg-[var(--cream)] px-4">
        <div className="max-w-md text-center">
          <p className="eyebrow">404 · Not Found</p>
          <h1
            className="text-6xl font-medium text-[var(--navy)] mt-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            This page has wandered off.
          </h1>
          <p className="mt-4 text-[var(--slate)]">Let's get you back to familiar ground.</p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-[var(--crimson)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--crimson)]/90 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  const prefersReducedMotion = useReducedMotion();

  if (isAdmin) return (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
      <Toaster position="top-right" richColors />
    </>
  );
}

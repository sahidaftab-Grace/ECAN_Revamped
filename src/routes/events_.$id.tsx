import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Share2,
  Bell,
  Ticket,
  ExternalLink,
  Info,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/events_/$id")({
  component: EventDetailPage,
  loader: async ({ params }: { params: { id: string } }) => {
    const { id } = params;

    try {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      return data;
    } catch (err) {
      throw notFound();
    }
  },
  head: ({ loaderData }: { loaderData: any }) => ({
    meta: [{ title: `${loaderData?.title} — ECAN Events` }],
  }),
});

const EVENT_TYPE_LABELS: Record<string, string> = {
  annual_day: 'Annual Day',
  picnic: 'Picnic',
  policy_dialogue: 'Policy Dialogue',
  workshop: 'Workshop',
  general: 'General Event',
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-emerald-50 text-emerald-700 border-emerald-100",
  ongoing: "bg-blue-50 text-blue-700 border-blue-100",
  past: "bg-slate-50 text-slate-700 border-slate-100",
};

// ── Page ──────────────────────────────────────────────────────────────────────
function EventDetailPage() {
  const event = Route.useLoaderData();
  const startDate = event.starts_at ? new Date(event.starts_at) : null;
  const endDate = event.ends_at ? new Date(event.ends_at) : null;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-[var(--navy)] relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Background Image with Overlay */}
        {event.cover_image && (
          <div className="absolute inset-0 opacity-20">
            <img 
              src={event.cover_image} 
              alt="" 
              className="w-full h-full object-cover blur-sm scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/80 to-transparent" />
          </div>
        )}
        
        <div className="container-page relative z-10">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-10 transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Events
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)]">
              {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
            </span>
            <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 border-white/10 text-white/80`}>
              {event.status}
            </span>
          </div>

          <h1 className="text-white text-hero max-w-4xl leading-[1.1]">
            {event.title}
          </h1>

          <div className="mt-10 flex flex-wrap gap-8 items-center text-white/70">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--gold)] border border-white/10">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Date</p>
                <p className="text-sm font-bold text-white">
                  {startDate ? format(startDate, "EEEE, d MMMM yyyy") : "To be announced"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--gold)] border border-white/10">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Time</p>
                <p className="text-sm font-bold text-white">
                  {startDate ? format(startDate, "h:mm a") : "TBA"} 
                  {endDate ? ` — ${format(endDate, "h:mm a")}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--gold)] border border-white/10">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Location</p>
                <p className="text-sm font-bold text-white">{event.location || "Location TBA"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page -mt-10 relative z-20">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-14 overflow-hidden"
            >
              {event.cover_image && (
                <div className="mb-12 rounded-3xl overflow-hidden aspect-video bg-slate-100 border border-slate-100">
                  <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="prose max-w-none">
                <ReactMarkdown>{event.description}</ReactMarkdown>
              </div>

              {event.map_url && (
                <div className="mt-14 pt-10 border-t border-slate-100">
                  <h3 className="text-xl font-bold text-[var(--navy)] mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[var(--primary)]" />
                    Event Location
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 h-64 flex items-center justify-center group relative">
                     {/* If it's an iframe URL, we could embed it, but safer to link for now */}
                     <div className="text-center p-8">
                        <p className="text-sm font-medium text-[var(--slate)] mb-4">View the detailed event location on Google Maps.</p>
                        <a 
                          href={event.map_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--navy)] text-white text-sm font-bold hover:bg-[var(--primary)] transition-all shadow-lg shadow-[var(--navy)]/20"
                        >
                           Open Maps <ExternalLink className="h-4 w-4" />
                        </a>
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Registration Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--navy)] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--primary)]/20 blur-[50px] pointer-events-none" />
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <Ticket className="h-6 w-6 text-[var(--gold)]" />
                </div>
                <h3 className="text-xl font-bold font-display">Event Participation</h3>
                <p className="mt-3 text-white/60 text-sm leading-relaxed">
                  Join us for this {EVENT_TYPE_LABELS[event.event_type] || 'sector'} gathering. {event.status === 'upcoming' ? 'Registration is currently open.' : 'This event has concluded.'}
                </p>
                
                {event.reg_url ? (
                  <Button 
                    className="w-full mt-8 h-14 rounded-2xl bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-[var(--navy)] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-[var(--gold)]/20"
                    asChild
                  >
                    <a href={event.reg_url} target="_blank" rel="noopener noreferrer">
                      Register for Event <ChevronRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-sm text-white/80">
                     <Info className="h-5 w-5 text-[var(--gold)] shrink-0" />
                     <span>Entry by official invitation only.</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] mb-4">Share Event</p>
                <Button variant="outline" className="w-full rounded-xl h-12 gap-2 text-sm">
                  <Share2 className="h-4 w-4" /> Copy Event Link
                </Button>
              </div>
              
              <div className="pt-6 border-t border-slate-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--slate)] mb-4">Notifications</p>
                <Button variant="ghost" className="w-full rounded-xl h-12 gap-2 text-sm text-[var(--primary)] hover:bg-[var(--primary)]/5">
                  <Bell className="h-4 w-4" /> Add to Calendar
                </Button>
              </div>
            </div>

            {/* Association Contact */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
               <h4 className="text-sm font-bold text-[var(--navy)] mb-2">Need Assistance?</h4>
               <p className="text-xs text-[var(--slate)] leading-relaxed mb-4">For any inquiries regarding this event, please contact the ECAN Secretariat.</p>
               <Link to="/contact" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1">
                 Contact Support <ChevronRight className="h-3 w-3" />
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact & Membership — ECAN" },
      {
        name: "description",
        content:
          "Reach the ECAN secretariat in Kathmandu, or apply to become a member of Nepal's national educational consultancy association.",
      },
    ],
  }),
});

function ContactPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    organisation: "",
    phone: "",
    reason: "Become an ECAN Member",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submissions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          subject: form.reason + (form.organisation ? ` (${form.organisation})` : ""),
          message: form.message
        }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <PageHeader
        eyebrow="Contact & Membership"
        title={
          <>
            Let's <span className="text-[var(--gold)]">Talk</span>
          </>
        }
        intro="Whether you're a parent, a student, a consultancy seeking membership or an overseas partner — we want to hear from you."
      />

      <section className="container-page py-12 md:py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        {/* Contact info */}
        <div className="lg:col-span-4 space-y-10">
          <div>
            <p className="eyebrow">Secretariat</p>
            <p className="mt-3 text-heading text-[var(--navy)] leading-snug">
              ECAN Office
              <br />
              Kathmandu, Nepal
            </p>
          </div>

          <ul className="space-y-6">
            {[
              {
                Icon: MapPin,
                label: "Address",
                content: "Registered with the Chief District Administration Office, Kathmandu.",
              },
              {
                Icon: Phone,
                label: "Phone",
                content: "+977-4521487 · +977-4522267",
              },
              {
                Icon: Mail,
                label: "Email",
                content: "info@ecan.org.np",
                href: "mailto:info@ecan.org.np",
              },
            ].map(({ Icon, label, content, href }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="h-10 w-10 rounded-lg bg-[var(--crimson)]/10 text-[var(--crimson)] flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-label text-[var(--slate)]">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-1 block text-body-sm text-[var(--navy)] hover:text-[var(--crimson)] transition-colors"
                    >
                      {content}
                    </a>
                  ) : (
                    <p className="mt-1 text-body-sm text-[var(--navy)]">{content}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact form */}
        {sent ? (
          <div className="lg:col-span-8 rounded-2xl border-2 border-[var(--border)] bg-white p-8 md:p-12 flex flex-col items-center justify-center gap-4 text-center min-h-[400px]">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
            <h2
              className="text-2xl text-[var(--navy)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Message Sent!
            </h2>
            <p className="text-[var(--slate)] text-sm max-w-sm">
              Thanks for reaching out. We'll get back to you within 1–2 business days.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setForm({
                  full_name: "",
                  email: "",
                  organisation: "",
                  phone: "",
                  reason: "Become an ECAN Member",
                  message: "",
                });
              }}
              className="mt-2 text-sm text-[var(--crimson)] hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-8 rounded-2xl border-2 border-[var(--border)] bg-white p-8 md:p-12 space-y-6"
          >
            <div>
              <h2
                className="text-2xl text-[var(--navy)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Send Us a Message
              </h2>
              <p className="mt-2 text-sm text-[var(--slate)]">
                We'll get back to you within 1–2 business days.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                label="Full Name"
                value={form.full_name}
                onChange={(v) => set("full_name", v)}
                required
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                label="Organisation"
                value={form.organisation}
                onChange={(v) => set("organisation", v)}
              />
              <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[var(--slate)] font-semibold">
                Reason
              </label>
              <select
                value={form.reason}
                onChange={(e) => set("reason", e.target.value)}
                className="w-full rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--navy)] focus:outline-none focus:border-[var(--crimson)] transition-colors"
              >
                <option>Become an ECAN Member</option>
                <option>Student / Parent Inquiry</option>
                <option>Overseas Partner Inquiry</option>
                <option>Press &amp; Media</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[var(--slate)] font-semibold">
                Message
              </label>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                className="w-full rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--navy)] focus:outline-none focus:border-[var(--crimson)] resize-none transition-colors"
                placeholder="Tell us a little about why you're reaching out…"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--crimson)] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[var(--crimson)]/90 transition-all shadow-lg shadow-[var(--crimson)]/20 hover:shadow-xl disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send Message"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </section>
    </>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-[var(--slate)] font-semibold">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--navy)] focus:outline-none focus:border-[var(--crimson)] transition-colors"
      />
    </div>
  );
}

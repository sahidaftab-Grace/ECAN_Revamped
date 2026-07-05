import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact ECAN" },
      {
        name: "description",
        content: "Contact ECAN for general inquiries, office information, and support.",
      },
    ],
  }),
});

const defaultContactContent = {
  eyebrow: "Contact ECAN",
  title: "Get in Touch",
  highlighted_text: "Touch",
  intro:
    "Send a general inquiry to the ECAN secretariat. Our team will review your message and respond through the appropriate channel.",
  side_eyebrow: "Secretariat",
  side_title: "General Information",
  side_intro:
    "Use this page for general questions, coordination, official communication, and secretariat support.",
  address_label: "Office Address",
  address: "Hattisar, Kathmandu, Nepal",
  phone_label: "Phone",
  phone: "+977-4521487 · +977-4522267",
  email_label: "Email",
  email: "info@ecan.org.np",
  hours_label: "Office Hours",
  hours: "Sunday to Friday, 10:00 AM - 5:00 PM",
  form_title: "Send a Message",
  form_intro: "Fill out the form below and the ECAN team will receive your inquiry in the admin backend.",
  success_title: "Message Sent",
  success_message: "Thank you. Your inquiry has been received by ECAN.",
};

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

type ContactContent = typeof defaultContactContent;
type FormState = typeof initialForm;

function ContactPage() {
  const [content, setContent] = useState<ContactContent>(defaultContactContent);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/home-content/contact-page", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload?.data) setContent({ ...defaultContactContent, ...payload.data });
      })
      .catch((err) => {
        if (err.name !== "AbortError") setContent(defaultContactContent);
      });

    return () => controller.abort();
  }, []);

  function set(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
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
          subject: form.subject || "General Inquiry",
          message: form.phone ? `Phone: ${form.phone}\n\n${form.message}` : form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setSent(true);
      setForm(initialForm);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const titlePrefix =
    content.highlighted_text && content.title.includes(content.highlighted_text)
      ? content.title.replace(content.highlighted_text, "").trim()
      : content.title;

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={
          <>
            {titlePrefix}{" "}
            {content.highlighted_text && (
              <span className="text-[var(--gold)]">{content.highlighted_text}</span>
            )}
          </>
        }
        intro={content.intro}
      />

      <section className="container-page py-12 md:py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4 space-y-8">
          <div>
            <p className="eyebrow">{content.side_eyebrow}</p>
            <h2 className="mt-3 text-heading text-[var(--navy)] leading-snug">
              {content.side_title}
            </h2>
            <p className="mt-5 text-body-sm text-[var(--slate)]">{content.side_intro}</p>
          </div>

          <div className="rounded-2xl border-2 border-[var(--border)] bg-white p-6 space-y-6">
            <InfoItem Icon={MapPin} label={content.address_label} value={content.address} />
            <InfoItem Icon={Phone} label={content.phone_label} value={content.phone} />
            <InfoItem Icon={Mail} label={content.email_label} value={content.email} />
            <InfoItem Icon={Clock} label={content.hours_label} value={content.hours} />
          </div>
        </aside>

        <div className="lg:col-span-8">
          {sent ? (
            <div className="rounded-2xl border-2 border-[var(--border)] bg-white p-8 md:p-12 flex flex-col items-center justify-center gap-4 text-center min-h-[440px]">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
              <h2 className="text-2xl text-[var(--navy)]" style={{ fontFamily: "var(--font-display)" }}>
                {content.success_title}
              </h2>
              <p className="text-[var(--slate)] text-sm max-w-md">{content.success_message}</p>
              <button
                onClick={() => setSent(false)}
                className="mt-2 text-sm text-[var(--crimson)] hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border-2 border-[var(--border)] bg-white p-8 md:p-12 space-y-8"
            >
              <div>
                <h2 className="text-2xl text-[var(--navy)]" style={{ fontFamily: "var(--font-display)" }}>
                  {content.form_title}
                </h2>
                <p className="mt-3 text-body-sm text-[var(--slate)]">{content.form_intro}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full Name" value={form.full_name} onChange={(v) => set("full_name", v)} required />
                <Field label="Email Address" type="email" value={form.email} onChange={(v) => set("email", v)} required />
                <Field label="Phone Number" value={form.phone} onChange={(v) => set("phone", v)} />
                <Field label="Subject" value={form.subject} onChange={(v) => set("subject", v)} placeholder="General inquiry" />
              </div>

              <TextareaField
                label="Message"
                value={form.message}
                onChange={(v) => set("message", v)}
                placeholder="Write your message here..."
                required
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--crimson)] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[var(--crimson)]/90 transition-all shadow-lg shadow-[var(--crimson)]/20 hover:shadow-xl disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function InfoItem({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="h-10 w-10 rounded-lg bg-[var(--gold)]/15 text-[var(--navy)] flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-label text-[var(--slate)]">{label}</p>
        <p className="mt-1 text-body-sm text-[var(--navy)] whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-[var(--slate)] font-semibold">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--navy)] focus:outline-none focus:border-[var(--crimson)] transition-colors"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-[var(--slate)] font-semibold">
        {label}
        {required ? " *" : ""}
      </label>
      <textarea
        rows={6}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--navy)] focus:outline-none focus:border-[var(--crimson)] resize-y transition-colors"
      />
    </div>
  );
}

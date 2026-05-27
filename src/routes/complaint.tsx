import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/complaint")({
  component: ComplaintPage,
});

type ComplainantType = "student" | "parent" | "member_consultancy" | "general_public" | "";
type ComplaintCategory =
  | "misleading_info"
  | "overcharging"
  | "visa_fraud"
  | "unregistered_consultancy"
  | "unprofessional_conduct"
  | "document_fraud"
  | "refund_dispute"
  | "other"
  | "";

const complainantLabels: Record<Exclude<ComplainantType, "">, string> = {
  student: "Student",
  parent: "Parent / Guardian",
  member_consultancy: "Member Consultancy",
  general_public: "General Public",
};

const categoryLabels: Record<Exclude<ComplaintCategory, "">, string> = {
  misleading_info: "Misleading or False Information",
  overcharging: "Overcharging / Undisclosed Fees",
  visa_fraud: "Visa / Admission Fraud",
  unregistered_consultancy: "Unregistered / Unlicensed Consultancy",
  unprofessional_conduct: "Unprofessional Conduct",
  document_fraud: "Document Forgery / Fraud",
  refund_dispute: "Refund Dispute",
  other: "Other",
};

const categoryDescriptions: Record<Exclude<ComplaintCategory, "">, string> = {
  misleading_info:
    "Provided inaccurate details about institutions, courses, fees or visa requirements.",
  overcharging: "Charged fees beyond agreed amounts or failed to provide receipts.",
  visa_fraud: "Submitted false documents or misrepresented visa/admission status.",
  unregistered_consultancy: "Operating without proper ECAN membership or government registration.",
  unprofessional_conduct: "Harassment, discrimination or breach of professional ethics.",
  document_fraud: "Forged transcripts, certificates or other official documents.",
  refund_dispute: "Refused or delayed refund of paid service charges.",
  other: "Any other concern not listed above.",
};

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[14px] font-bold text-[var(--navy)]">
        {label} {required && <span className="text-[var(--crimson)]">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 pr-10 text-[15px] text-[var(--navy)] focus:border-blue-500 focus:outline-none transition-colors"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--slate)]" />
      </div>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  hint,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[14px] font-bold text-[var(--navy)]">
        {label} {required && <span className="text-[var(--crimson)]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--navy)] placeholder:text-[var(--slate)] focus:border-blue-500 focus:outline-none transition-colors"
      />
      {hint && <p className="text-caption text-[var(--slate)]">{hint}</p>}
    </div>
  );
}

function ComplaintPage() {
  const [submitted, setSubmitted] = useState(false);

  // Complainant info
  const [complainantType, setComplainantType] = useState<ComplainantType>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Complaint subject
  const [againstType, setAgainstType] = useState<"consultancy" | "institution" | "individual" | "">(
    "",
  );
  const [againstName, setAgainstName] = useState("");
  const [againstLocation, setAgainstLocation] = useState("");

  // Complaint details
  const [category, setCategory] = useState<ComplaintCategory>("");
  const [incidentDate, setIncidentDate] = useState("");
  const [amountInvolved, setAmountInvolved] = useState("");
  const [description, setDescription] = useState("");
  const [desiredResolution, setDesiredResolution] = useState("");
  const [previousAction, setPreviousAction] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [refNumber, setRefNumber] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    setSubmitError("");

    const ref = `ECAN-${Date.now().toString().slice(-8)}`;

    try {
      const res = await fetch("/api/submissions/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: anonymous ? "Anonymous" : fullName,
          email: anonymous ? "anonymous@ecan.org.np" : email,
          phone: anonymous ? "" : phone,
          subject: `${categoryLabels[category as Exclude<ComplaintCategory, "">]} against ${againstName}`,
          description: `
**Ref:** ${ref}
**Complainant Type:** ${complainantLabels[complainantType as Exclude<ComplainantType, "">]}
**Against Type:** ${againstType}
**Against Location:** ${againstLocation}
**Incident Date:** ${incidentDate}
**Amount Involved:** ${amountInvolved} NPR

**Description:**
${description}

**Desired Resolution:**
${desiredResolution}

**Previous Action:**
${previousAction}
          `.trim()
        }),
      });

      if (res.ok) {
        setRefNumber(ref);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit complaint");
      }
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <>
        <PageHeader
          eyebrow="Complaint Portal"
          title={
            <>
              Submit a <span className="text-[var(--gold)]">Complaint</span>
            </>
          }
          intro="ECAN investigates all complaints in confidence and takes appropriate action."
        />
        <section className="container-page py-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-green-200 bg-green-50 p-10 text-center"
          >
            <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
            <h2
              className="mt-6 text-2xl font-semibold text-[var(--navy)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Complaint Received
            </h2>
            <p className="mt-3 text-[var(--slate)] leading-relaxed">
              Thank you for bringing this to our attention. ECAN will review your complaint and
              respond within <strong>7 working days</strong>.
              {!anonymous && email && (
                <>
                  {" "}
                  A confirmation will be sent to <strong>{email}</strong>.
                </>
              )}
            </p>
            <p className="mt-4 text-sm text-[var(--slate)]">
              Reference:{" "}
              <span className="font-mono font-semibold text-[var(--navy)]">{refNumber}</span>
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setComplainantType("");
                setFullName("");
                setEmail("");
                setPhone("");
                setAddress("");
                setAgainstType("");
                setAgainstName("");
                setAgainstLocation("");
                setCategory("");
                setIncidentDate("");
                setAmountInvolved("");
                setDescription("");
                setDesiredResolution("");
                setPreviousAction("");
                setAnonymous(false);
                setConsent(false);
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-md border-2 border-[var(--navy)] px-6 py-3 text-sm font-semibold text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-all"
            >
              Submit Another Complaint
            </button>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Complaint Portal"
        title={
          <>
            Submit a <span className="text-[var(--gold)]">Complaint</span>
          </>
        }
        intro="ECAN investigates all complaints in confidence. All submissions are reviewed by the Ethics & Compliance Committee."
      />

      <section className="container-page py-12 pb-24 max-w-3xl">
        {/* Info banner */}
        <div className="mb-8 flex gap-4 rounded-xl bg-blue-50 border border-blue-200 p-5">
          <ShieldAlert className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 leading-relaxed">
            <strong>Confidential & Secure.</strong> Your complaint is handled strictly by ECAN's
            Ethics Committee. You may submit anonymously, though providing contact details helps us
            follow up and resolve your case faster.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ── Section 1: Who is complaining ── */}
          <div className="rounded-2xl border-2 border-[var(--border)] p-6 md:p-8 space-y-5">
            <div>
              <p className="text-label text-[var(--crimson)] mb-1">
                Section 1
              </p>
              <h3 className="text-subheading text-[var(--navy)]">
                About You
              </h3>
              <p className="text-body-sm text-[var(--slate)] mt-1">
                Tell us who you are. You may submit anonymously by checking the box below.
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)] accent-blue-600"
              />
              <span className="text-sm text-[var(--navy)]">Submit anonymously</span>
            </label>

            <SelectField
              label="I am a"
              value={complainantType}
              onChange={(v) => setComplainantType(v as ComplainantType)}
              placeholder="Select your role…"
              required
              options={Object.entries(complainantLabels).map(([value, label]) => ({
                value,
                label,
              }))}
            />

            {!anonymous && (
              <div className="grid sm:grid-cols-2 gap-5">
                <InputField
                  label="Full Name"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Your full name"
                  required={!anonymous}
                />
                <InputField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  required={!anonymous}
                />
                <InputField
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  placeholder="+977-98XXXXXXXX"
                />
                <InputField
                  label="District / City"
                  value={address}
                  onChange={setAddress}
                  placeholder="e.g. Kathmandu"
                />
              </div>
            )}
          </div>

          {/* ── Section 2: Who is being complained about ── */}
          <div className="rounded-2xl border-2 border-[var(--border)] p-6 md:p-8 space-y-5">
            <div>
              <p className="text-label text-[var(--crimson)] mb-1">
                Section 2
              </p>
              <h3 className="text-subheading text-[var(--navy)]">
                Who is this complaint about?
              </h3>
              <p className="text-body-sm text-[var(--slate)] mt-1">
                Provide as much detail as you know about the party being complained about.
              </p>
            </div>

            <SelectField
              label="Complaint against"
              value={againstType}
              onChange={(v) => setAgainstType(v as typeof againstType)}
              placeholder="Select type…"
              required
              options={[
                { value: "consultancy", label: "Educational Consultancy / Agency" },
                { value: "institution", label: "Foreign Educational Institution" },
                { value: "individual", label: "Individual (Agent / Staff)" },
              ]}
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <InputField
                label="Name of Consultancy / Institution / Individual"
                value={againstName}
                onChange={setAgainstName}
                placeholder="e.g. ABC Education Consultancy"
                required
              />
              <InputField
                label="Location / City"
                value={againstLocation}
                onChange={setAgainstLocation}
                placeholder="e.g. Pokhara, Nepal"
              />
            </div>
          </div>

          {/* ── Section 3: Complaint details ── */}
          <div className="rounded-2xl border-2 border-[var(--border)] p-6 md:p-8 space-y-5">
            <div>
              <p className="text-label text-[var(--crimson)] mb-1">
                Section 3
              </p>
              <h3 className="text-subheading text-[var(--navy)]">
                Complaint Details
              </h3>
              <p className="text-body-sm text-[var(--slate)] mt-1">
                Describe the issue clearly. The more detail you provide, the faster we can act.
              </p>
            </div>

            <SelectField
              label="Nature of Complaint"
              value={category}
              onChange={(v) => setCategory(v as ComplaintCategory)}
              placeholder="Select category…"
              required
              options={Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))}
            />

            {category && category !== "" && (
              <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                {categoryDescriptions[category as Exclude<ComplaintCategory, "">]}
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <InputField
                label="Date of Incident"
                type="date"
                value={incidentDate}
                onChange={setIncidentDate}
                required
              />
              <InputField
                label="Amount Involved (NPR)"
                type="number"
                value={amountInvolved}
                onChange={setAmountInvolved}
                placeholder="e.g. 150000"
                hint="Leave blank if not applicable"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-bold text-[var(--navy)]">
                Describe the Complaint <span className="text-[var(--crimson)]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                placeholder="Describe what happened in detail — include dates, amounts paid, promises made, and any other relevant facts…"
                className="rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--navy)] placeholder:text-[var(--slate)] focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />
              <p className="text-caption text-[var(--slate)]">{description.length} / 2000 characters</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-bold text-[var(--navy)]">
                What resolution are you seeking?
              </label>
              <textarea
                value={desiredResolution}
                onChange={(e) => setDesiredResolution(e.target.value)}
                rows={3}
                placeholder="e.g. Full refund of NPR 150,000 paid as service charge, or cancellation of membership…"
                className="rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--navy)] placeholder:text-[var(--slate)] focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-bold text-[var(--navy)]">
                Have you taken any prior action?
              </label>
              <textarea
                value={previousAction}
                onChange={(e) => setPreviousAction(e.target.value)}
                rows={2}
                placeholder="e.g. Contacted the consultancy directly on 12 Jan 2025 — no response received…"
                className="rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--navy)] placeholder:text-[var(--slate)] focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* ── Consent & Submit ── */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-blue-600 flex-shrink-0"
              />
              <span className="text-sm text-[var(--slate)] leading-relaxed">
                I confirm that the information provided is accurate to the best of my knowledge. I
                understand that ECAN will handle this complaint in confidence and may contact me for
                further information. <span className="text-[var(--crimson)]">*</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={!consent || submitting}
              className="w-full rounded-xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit Complaint"}
            </button>
            {submitError && <p className="text-sm text-red-600 text-center">{submitError}</p>}
          </div>
        </form>
      </section>
    </>
  );
}

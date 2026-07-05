import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileUp, Loader2, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/complaint")({
  component: ComplaintPage,
});

const relationshipOptions = [
  "Student (विद्यार्थी)",
  "Parent / Guardian (अभिभावक)",
  "Relative (नातेदार)",
  "Sponsor (प्रायोजक)",
  "Stakeholder (सरोकारवाला)",
  "Other (अन्य)",
];

const communicationOptions = [
  "Phone Call (फोन कल)",
  "Email (इमेल)",
  "WhatsApp (व्हाट्सएप)",
  "Viber (भाइबर)",
];

const submissionTypes = [
  "Complaint (गुनासो)",
  "Feedback (प्रतिक्रिया)",
  "Suggestion (सुझाव)",
  "Appreciation (प्रशंसा)",
  "Request for Mediation (मध्यस्थताको अनुरोध)",
];

const issueAreas = [
  "Counseling Service (परामर्श सेवा)",
  "Documentation Process (कागजात प्रक्रिया)",
  "Admission Process (भर्ना प्रक्रिया)",
  "Visa Application (भिसा आवेदन)",
  "Financial Transaction (आर्थिक कारोबार)",
  "Communication Issue (सञ्चार समस्या)",
  "Service Quality (सेवाको गुणस्तर)",
  "Ethical Concern (नैतिक आचरण सम्बन्धी)",
  "Misleading Information (भ्रामक जानकारी)",
  "Delay in Service (सेवा ढिलाइ)",
  "Refund Issue (फिर्ता रकम सम्बन्धी)",
  "Other (अन्य)",
];

type FormState = {
  full_name: string;
  contact_number: string;
  email: string;
  relationship: string;
  communication_method: string;
  consultancy_name: string;
  branch_location: string;
  counselor_name: string;
  submission_type: string;
  issue_area: string;
  incident_date: string;
  study_country: string;
  description: string;
  expected_resolution: string;
  truth_declaration: boolean;
  process_declaration: boolean;
  privacy_declaration: boolean;
};

const initialForm: FormState = {
  full_name: "",
  contact_number: "",
  email: "",
  relationship: "",
  communication_method: "",
  consultancy_name: "",
  branch_location: "",
  counselor_name: "",
  submission_type: "",
  issue_area: "",
  incident_date: "",
  study_country: "",
  description: "",
  expected_resolution: "",
  truth_declaration: false,
  process_declaration: false,
  privacy_declaration: false,
};

function FieldLabel({ children, required, nepali }: { children: string; required?: boolean; nepali?: string }) {
  return (
    <label className="text-[14px] font-bold text-[var(--navy)]">
      {children} {required && <span className="text-[var(--crimson)]">*</span>}
      {nepali && <span className="mt-0.5 block text-[12px] font-medium text-[var(--slate)]">{nepali}</span>}
    </label>
  );
}

function TextInput({
  label,
  nepali,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  nepali?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <FieldLabel required={required} nepali={nepali}>
        {label}
      </FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--navy)] placeholder:text-[var(--slate)] focus:border-blue-600 focus:outline-none"
      />
    </div>
  );
}

function SelectInput({
  label,
  nepali,
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  label: string;
  nepali?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <FieldLabel required={required} nepali={nepali}>
        {label}
      </FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--navy)] focus:border-blue-600 focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SectionTitle({ title, nepali }: { title: string; nepali: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-[var(--border)] pb-3">
      <span className="h-6 w-1.5 rounded-full bg-[var(--gold)]" />
      <h3 className="text-xl font-bold text-[var(--navy)]">
        {title} <span className="block text-sm font-medium text-[var(--slate)]">{nepali}</span>
      </h3>
    </div>
  );
}

function ComplaintPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [documents, setDocuments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [submitError, setSubmitError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      payload.append(key, String(value));
    });
    documents.forEach((file) => payload.append("documents", file));

    try {
      const res = await fetch("/api/submissions/complaint", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit complaint");

      setReferenceNumber(data.reference_number || data.data?.reference_number || "");
      setSubmitted(true);
      setForm(initialForm);
      setDocuments([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <>
        <PageHeader
          eyebrow="Official Complaint & Feedback Portal"
          title={
            <>
              Complaint <span className="text-[var(--gold)]">Received</span>
            </>
          }
          intro="Your submission has been recorded by ECAN for confidential review, coordination, and mediation where required."
        />
        <section className="container-page max-w-2xl py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-green-200 bg-green-50 p-10 text-center"
          >
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
            <h2 className="mt-6 text-2xl font-bold text-[var(--navy)]">Submission Received</h2>
            <p className="mt-3 text-[var(--slate)]">
              ECAN Secretariat will review the complaint / feedback and coordinate with concerned
              parties where required.
            </p>
            {referenceNumber && (
              <p className="mt-5 rounded-xl bg-white px-4 py-3 text-sm text-[var(--slate)]">
                Reference Number: <span className="font-mono font-bold text-[var(--navy)]">{referenceNumber}</span>
              </p>
            )}
            <button
              onClick={() => setSubmitted(false)}
              className="mt-8 rounded-xl bg-[var(--navy)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--primary)]"
            >
              Submit Another Form
            </button>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Official Complaint & Feedback Portal"
        title={
          <>
            ECAN Complaint & <span className="text-[var(--gold)]">Feedback Form</span>
          </>
        }
        intro="If you have faced any issue, concern, discomfort, or service-related problem during your abroad study process through an ECAN member consultancy, submit your details with supporting evidence."
      />

      <section className="container-page grid gap-8 py-12 pb-24 lg:grid-cols-[0.85fr_1.45fr]">
        <aside className="space-y-5">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start gap-3 rounded-xl border-l-4 border-[var(--gold)] bg-amber-50 p-4 text-sm text-[var(--navy)]">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
              <div>
                <strong>ECAN Official Portal Notice</strong>
                <p className="mt-1 text-[var(--slate)]">
                  This form is intended only for matters related to ECAN member consultancies.
                </p>
                <p className="mt-1 text-xs text-[var(--slate)]">
                  यो फाराम ECAN सदस्य परामर्श संस्थासँग सम्बन्धित विषयका लागि मात्र हो।
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[var(--navy)]">Before You Submit</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">
              Please provide clear and genuine information. Your submission will help ECAN review
              the matter, coordinate with concerned parties, and support mediation where required.
            </p>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
              <strong>Confidential Review</strong>
              <p className="mt-1">
                All complaints and feedback are collected confidentially and used only for review,
                coordination, mediation, and related official processes.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[var(--navy)]">Process Flow</h2>
            <ol className="mt-5 space-y-4">
              {[
                "Submission received by ECAN Secretariat",
                "Preliminary review of complaint and documents",
                "Coordination with concerned consultancy if required",
                "Mediation or further process as per nature of case",
                "Case update or closure after review",
              ].map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-[var(--slate)]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--navy)] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 border-b-2 border-[var(--navy)] pb-5">
            <h2 className="text-2xl font-bold text-[var(--navy)]">
              Submit Your Complaint / Feedback
              <span className="mt-1 block text-sm font-medium text-[var(--slate)]">
                आफ्नो गुनासो / प्रतिक्रिया पेश गर्नुहोस्
              </span>
            </h2>
            <p className="mt-3 text-sm text-[var(--slate)]">
              Fields marked with <span className="text-[var(--crimson)]">*</span> are required.
            </p>
          </div>

          <SectionTitle title="Applicant Information" nepali="निवेदकको जानकारी" />
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput label="Full Name" nepali="पूरा नाम" value={form.full_name} onChange={(v) => update("full_name", v)} placeholder="Enter your full name" required />
            <TextInput label="Contact Number" nepali="सम्पर्क नम्बर" value={form.contact_number} onChange={(v) => update("contact_number", v)} placeholder="Enter your contact number" type="tel" required />
            <TextInput label="Email Address" nepali="इमेल ठेगाना" value={form.email} onChange={(v) => update("email", v)} placeholder="Enter your email address" type="email" />
            <SelectInput label="Your Relationship" nepali="तपाईंको परिचय" value={form.relationship} onChange={(v) => update("relationship", v)} options={relationshipOptions} placeholder="Select relationship (परिचय छान्नुहोस्)" required />
            <div className="md:col-span-2">
              <SelectInput label="Preferred Communication Method" nepali="सम्पर्कको प्राथमिक माध्यम" value={form.communication_method} onChange={(v) => update("communication_method", v)} options={communicationOptions} placeholder="Select preferred method (प्राथमिक माध्यम छान्नुहोस्)" />
            </div>
          </div>

          <div className="mt-10">
            <SectionTitle title="Consultancy Information" nepali="परामर्श संस्थाको जानकारी" />
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput label="Name of ECAN Member Consultancy" nepali="ECAN सदस्य परामर्श संस्थाको नाम" value={form.consultancy_name} onChange={(v) => update("consultancy_name", v)} placeholder="Enter consultancy name" required />
              <TextInput label="Branch / Location" nepali="शाखा / स्थान" value={form.branch_location} onChange={(v) => update("branch_location", v)} placeholder="Enter branch or location" />
              <div className="md:col-span-2">
                <TextInput label="Name of Counselor / Representative, if known" nepali="काउन्सेलर वा प्रतिनिधिको नाम, थाहा भएमा" value={form.counselor_name} onChange={(v) => update("counselor_name", v)} placeholder="Enter counselor or representative name" />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <SectionTitle title="Complaint / Feedback Details" nepali="गुनासो / प्रतिक्रियाको विवरण" />
            <div className="grid gap-5 md:grid-cols-2">
              <SelectInput label="Type of Submission" nepali="पेश गरिएको विवरणको प्रकार" value={form.submission_type} onChange={(v) => update("submission_type", v)} options={submissionTypes} placeholder="Select submission type (प्रकार छान्नुहोस्)" required />
              <SelectInput label="Area Related To" nepali="सम्बन्धित विषय" value={form.issue_area} onChange={(v) => update("issue_area", v)} options={issueAreas} placeholder="Select area (विषय छान्नुहोस्)" required />
              <TextInput label="Date of Incident / Issue" nepali="घटना वा समस्याको मिति" value={form.incident_date} onChange={(v) => update("incident_date", v)} type="date" />
              <TextInput label="Country of Intended Study" nepali="अध्ययन गर्न चाहेको देश" value={form.study_country} onChange={(v) => update("study_country", v)} placeholder="Example: Australia, UK, Canada" />
              <div className="grid gap-1.5 md:col-span-2">
                <FieldLabel required nepali="समस्याको विस्तृत विवरण">
                  Detailed Description
                </FieldLabel>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  required
                  rows={6}
                  placeholder="Please describe what happened, when it happened, and who was involved."
                  className="rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--navy)] placeholder:text-[var(--slate)] focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div className="grid gap-1.5 md:col-span-2">
                <FieldLabel nepali="अपेक्षित समाधान">Expected Resolution</FieldLabel>
                <textarea
                  value={form.expected_resolution}
                  onChange={(e) => update("expected_resolution", e.target.value)}
                  rows={4}
                  placeholder="Please mention what kind of support or resolution you are expecting from ECAN."
                  className="rounded-lg border-2 border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--navy)] placeholder:text-[var(--slate)] focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <SectionTitle title="Supporting Documents" nepali="समर्थन गर्ने कागजातहरू" />
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-slate-50 px-6 py-8 text-center hover:border-[var(--navy)] hover:bg-white">
              <FileUp className="h-8 w-8 text-[var(--navy)]" />
              <span className="mt-3 text-sm font-bold text-[var(--navy)]">Upload Evidence / Documents</span>
              <span className="mt-1 text-xs text-[var(--slate)]">
                PDF, JPG, PNG, DOC, DOCX. Receipts, screenshots, emails, agreements, or relevant files.
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                onChange={(e) => setDocuments(Array.from(e.target.files || []))}
              />
            </label>
            {documents.length > 0 && (
              <div className="mt-3 grid gap-2">
                {documents.map((file) => (
                  <p key={`${file.name}-${file.size}`} className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-[var(--slate)]">
                    {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10">
            <SectionTitle title="Declaration" nepali="घोषणा" />
            <div className="space-y-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              {[
                ["truth_declaration", "I confirm that the information provided is true and accurate to the best of my knowledge.", "मैले उपलब्ध गराएको जानकारी मेरो जानकारी अनुसार सही र सत्य हो भन्ने पुष्टि गर्दछु।"],
                ["process_declaration", "I understand that ECAN may contact me for additional information during the review process.", "समीक्षा प्रक्रियाका क्रममा ECAN ले थप जानकारीका लागि सम्पर्क गर्न सक्ने कुरा म बुझ्दछु।"],
                ["privacy_declaration", "I understand that submission of this form does not automatically guarantee a specific outcome or decision.", "यो फाराम पेश गरेपछि कुनै निश्चित निर्णय वा नतिजाको सुनिश्चितता हुँदैन भन्ने कुरा म बुझ्दछु।"],
              ].map(([key, english, nepali]) => (
                <label key={key} className="flex items-start gap-3 text-sm text-[var(--navy)]">
                  <input
                    type="checkbox"
                    checked={Boolean(form[key as keyof FormState])}
                    onChange={(e) => update(key as keyof FormState, e.target.checked as never)}
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                  />
                  <span>
                    {english}
                    <span className="mt-1 block text-xs text-[var(--slate)]">{nepali}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border-l-4 border-[var(--gold)] bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Privacy Notice:</strong> Information submitted through this form will be handled
            confidentially and used only for complaint review, feedback management, coordination,
            mediation, and related official processes.
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--slate)]">
              Secretariat, Nepal Educational Consultancy Association (ECAN)
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit Complaint / Feedback"}
            </button>
          </div>
          {submitError && <p className="mt-4 text-center text-sm text-red-600">{submitError}</p>}
        </form>
      </section>
    </>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const PROJECT_TYPES_TR = [
  "Ağ / Altyapı",
  "Bulut / Sunucu",
  "Siber Güvenlik",
  "Yazılım Geliştirme",
  "YZ / Otomasyon",
  "Diğer",
];

const PROJECT_TYPES_EN = [
  "Network / Infrastructure",
  "Cloud / Servers",
  "Cyber Security",
  "Software Development",
  "AI / Automation",
  "Other",
];

const BUDGETS_TR = [
  "Henüz net değil",
  "10.000 TL altı",
  "10.000 – 50.000 TL",
  "50.000 – 150.000 TL",
  "150.000 TL+",
];

const BUDGETS_EN = [
  "Not sure yet",
  "Under $1k",
  "$1k – $5k",
  "$5k – $15k",
  "$15k+",
];

export function AvailabilityStatus() {
  const { t, locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const projectTypes = locale === "en" ? PROJECT_TYPES_EN : PROJECT_TYPES_TR;
  const budgets = locale === "en" ? BUDGETS_EN : BUDGETS_TR;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      projectType: String(form.get("projectType") || ""),
      budget: String(form.get("budget") || ""),
      message: String(form.get("message") || ""),
    };

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || t.ticket.error);
      setSent(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.ticket.error);
    } finally {
      setSending(false);
    }
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setSent(false);
      setError("");
    }, 300);
  }

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full glass px-3 py-2 text-xs transition hover:border-emerald-400/40 hover:bg-emerald-400/10"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-muted">{t.common.available}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ticket-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-500/80">
                    {t.ticket.eyebrow}
                  </p>
                  <h2 id="ticket-title" className="mt-1 font-heading text-xl text-foreground">
                    {t.ticket.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{t.ticket.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-line p-2 text-muted transition hover:border-cyan-400/40 hover:text-foreground"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-[min(78vh,640px)] overflow-y-auto px-5 py-5">
                {sent ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                      ✓
                    </div>
                    <p className="font-heading text-lg text-foreground">{t.ticket.successTitle}</p>
                    <p className="mt-2 text-sm text-muted">{t.ticket.successBody}</p>
                    <button
                      type="button"
                      onClick={close}
                      className="mt-6 rounded-full border border-line px-5 py-2 text-sm text-foreground/80 transition hover:border-cyan-400/40"
                    >
                      {t.ticket.close}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label={t.common.name} name="name" required placeholder={t.ticket.namePh} />
                      <Field
                        label={t.common.email}
                        name="email"
                        type="email"
                        required
                        placeholder={t.ticket.emailPh}
                      />
                      <Field label={t.common.phone} name="phone" placeholder={t.ticket.phonePh} />
                      <Field label={t.ticket.company} name="company" placeholder={t.ticket.companyPh} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-sm">
                        <span className="mb-1.5 block text-xs text-muted">{t.ticket.projectType}</span>
                        <select
                          name="projectType"
                          className="w-full rounded-xl border border-line bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-cyan-400/40"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            {t.ticket.projectTypePh}
                          </option>
                          {projectTypes.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm">
                        <span className="mb-1.5 block text-xs text-muted">{t.ticket.budget}</span>
                        <select
                          name="budget"
                          className="w-full rounded-xl border border-line bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-cyan-400/40"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            {t.ticket.budgetPh}
                          </option>
                          {budgets.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="block text-sm">
                      <span className="mb-1.5 block text-xs text-muted">{t.common.message}</span>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        placeholder={t.ticket.messagePh}
                        className="w-full resize-none rounded-xl border border-line bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-cyan-400/40"
                      />
                    </label>

                    {error ? <p className="text-sm text-red-300">{error}</p> : null}

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
                    >
                      {sending ? t.ticket.sending : t.ticket.submit}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-xs text-muted">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-cyan-400/40"
      />
    </label>
  );
}

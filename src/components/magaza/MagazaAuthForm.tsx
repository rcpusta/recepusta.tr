"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  LayoutDashboard,
  Lock,
  Mail,
  Phone,
  Server,
  ShieldCheck,
  User,
} from "lucide-react";
import { customerLoginAction, customerSignupAction } from "@/app/magaza/actions";
import { magazaEase } from "@/components/magaza/MagazaAtmosphere";
import { COUNTRIES, findCountry, formatPhoneWithDial } from "@/lib/countries";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

const loginBenefits = [
  {
    icon: LayoutDashboard,
    title: "Müşteri paneli",
    text: "Servisler, faturalar ve destek tek yerden.",
  },
  {
    icon: Server,
    title: "Hızlı sipariş",
    text: "Giriş sonrası paketleri anında sipariş edin.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli oturum",
    text: "Hesabınız şifreli oturum ile korunur.",
  },
];

const signupBenefits = [
  {
    icon: ShieldCheck,
    title: "Güvenli hesap",
    text: "Kimlik bilgileriniz güvenli şekilde korunur.",
  },
  {
    icon: Lock,
    title: "Ödeme ayrımı",
    text: "Kart bilgisi bu sitede tutulmaz; ödeme güvenli sayfada.",
  },
  {
    icon: Headphones,
    title: "7/24 destek",
    text: "Sipariş sonrası müşteri paneli ve destek erişimi.",
  },
];

function passwordScore(value: string) {
  let score = 0;
  if (value.length >= 6) score += 1;
  if (value.length >= 10) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

export function MagazaAuthForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/magaza";
  const registered = search.get("registered") === "1";

  const modeFromQuery = search.get("mode");
  const [mode, setMode] = useState<Mode>(
    modeFromQuery === "signup" || modeFromQuery === "kayit"
      ? "signup"
      : modeFromQuery === "login" || modeFromQuery === "giris"
        ? "login"
        : initialMode
  );

  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("TR");
  const [dialCode, setDialCode] = useState("+90");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [pending, startTransition] = useTransition();
  const score = useMemo(() => passwordScore(password), [password]);
  const benefits = mode === "login" ? loginBenefits : signupBenefits;

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError("");
    setPassword("");
    setShowPassword(false);
    setPhoneLocal("");
    const url = new URL(window.location.href);
    url.searchParams.set("mode", nextMode);
    if (nextMode !== "login") {
      url.searchParams.delete("registered");
    }
    window.history.replaceState({}, "", url.pathname + url.search);
  }

  function onCountryChange(code: string) {
    const country = findCountry(code);
    setCountryCode(country.code);
    setDialCode(country.dial);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      if (mode === "login") {
        const result = await customerLoginAction(formData);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.push(next);
        router.refresh();
        return;
      }

      formData.set("country", countryCode);
      formData.set("phonenumber", formatPhoneWithDial(dialCode, phoneLocal));

      const result = await customerSignupAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.redirectTo) {
        router.push(`/magaza/hesap?mode=login&registered=1&next=${encodeURIComponent(next)}`);
        return;
      }
      router.push(next);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-[var(--mz-border)] bg-[var(--mz-surface)] shadow-[0_30px_80px_var(--mz-glow)] lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative overflow-hidden border-b border-[var(--mz-border)] bg-gradient-to-br from-[var(--mz-brand)] via-[#1d4ed8] to-[var(--mz-brand-2)] p-8 text-white md:p-9 lg:border-b-0 lg:border-r lg:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-3xl" />

        <div className="relative flex h-full flex-col">
          <Link
            href="/magaza"
            className="inline-flex w-fit text-sm font-medium text-white/80 transition hover:text-white"
          >
            ← Mağazaya dön
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: magazaEase }}
              className="mt-8"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Recep Usta Cloud
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold leading-tight tracking-tight md:text-[2.35rem]">
                {mode === "login" ? "Hesabınıza giriş yapın" : "Altyapıya bir adımla başlayın"}
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
                {mode === "login"
                  ? "Mağaza siparişleri ve müşteri paneline erişmek için oturum açın."
                  : "Hosting ve sunucu paketlerine erişim için hesabınızı oluşturun."}
              </p>
            </motion.div>
          </AnimatePresence>

          <ul className="relative mt-8 space-y-3">
            <AnimatePresence mode="wait">
              {benefits.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={`${mode}-${item.title}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.35, ease: magazaEase }}
                    className="flex gap-3 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-white/75">{item.text}</p>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      </aside>

      <div className="flex flex-col justify-center p-7 md:p-9 lg:p-10">
        {/* Single toggle control */}
        <div className="relative mb-7 grid grid-cols-2 rounded-xl border border-[var(--mz-border)] bg-[var(--mz-bg-elevated)] p-1">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={cn(
              "relative rounded-lg py-2.5 text-sm font-semibold transition",
              mode === "login" ? "text-white" : "text-[var(--mz-muted)] hover:text-[var(--mz-text)]"
            )}
          >
            {mode === "login" ? (
              <motion.span
                layoutId="auth-mode-pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--mz-brand)] to-[var(--mz-brand-2)] shadow-[0_8px_24px_var(--mz-glow)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="relative z-[1]">Giriş yap</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={cn(
              "relative rounded-lg py-2.5 text-sm font-semibold transition",
              mode === "signup" ? "text-white" : "text-[var(--mz-muted)] hover:text-[var(--mz-text)]"
            )}
          >
            {mode === "signup" ? (
              <motion.span
                layoutId="auth-mode-pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--mz-brand)] to-[var(--mz-brand-2)] shadow-[0_8px_24px_var(--mz-glow)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="relative z-[1]">Kayıt ol</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: magazaEase }}
            className="flex flex-col"
          >
            <div>
              <span className="mz-kicker">{mode === "login" ? "Müşteri girişi" : "Yeni müşteri"}</span>
              <h2 className="mz-title mt-3 text-2xl md:text-3xl">
                {mode === "login" ? "Hoş geldiniz" : "Hesap oluştur"}
              </h2>
              <p className="mt-2 text-sm text-[var(--mz-muted)]">
                {mode === "login"
                  ? "E-posta ve şifrenizle devam edin."
                  : "Bilgilerinizi girin — birkaç saniyede hesabınız hazır."}
              </p>
            </div>

            {mode === "login" && registered ? (
              <p className="mt-5 flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--mz-ok)_30%,transparent)] bg-[color-mix(in_srgb,var(--mz-ok)_10%,transparent)] px-3.5 py-2.5 text-sm text-[var(--mz-ok)]">
                <CheckCircle2 size={15} className="shrink-0" />
                Kayıt tamam. Giriş yapabilirsiniz.
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-5">
              {mode === "signup" ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field icon={User} label="Ad" name="firstname" required autoComplete="given-name" />
                  <Field icon={User} label="Soyad" name="lastname" required autoComplete="family-name" />
                </div>
              ) : null}

              <Field
                icon={Mail}
                label="E-posta"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ornek@mail.com"
              />

              {mode === "signup" ? (
                <>
                  <label className="block min-w-0">
                    <span className="mz-label">Ülke</span>
                    <div className="relative">
                      <select
                        name="country"
                        value={countryCode}
                        onChange={(e) => onCountryChange(e.target.value)}
                        className="mz-input appearance-none pr-10"
                        autoComplete="country"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--mz-faint)]">
                        ▾
                      </span>
                    </div>
                  </label>

                  <label className="block min-w-0">
                    <span className="mz-label">Telefon</span>
                    <div className="flex gap-2">
                      <div className="relative w-[8.5rem] shrink-0">
                        <select
                          value={dialCode}
                          onChange={(e) => {
                            const nextDial = e.target.value;
                            setDialCode(nextDial);
                            const match = COUNTRIES.find((c) => c.dial === nextDial);
                            if (match) setCountryCode(match.code);
                          }}
                          className="mz-input appearance-none px-3 pr-8 font-mono text-sm"
                          aria-label="Ülke kodu"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={`${c.code}-${c.dial}`} value={c.dial}>
                              {c.flag} {c.dial}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--mz-faint)]">
                          ▾
                        </span>
                      </div>
                      <div className="relative min-w-0 flex-1">
                        <Phone size={15} className="mz-field-icon" />
                        <input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel-national"
                          placeholder="5xx xxx xx xx"
                          value={phoneLocal}
                          onChange={(e) => setPhoneLocal(e.target.value)}
                          className="mz-input mz-input-icon"
                        />
                      </div>
                    </div>
                  </label>
                </>
              ) : null}

              <label className="block min-w-0">
                <span className="mz-label">Şifre</span>
                <div className="relative">
                  <Lock size={15} className="mz-field-icon" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={mode === "signup" ? 6 : undefined}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mz-input mz-input-icon mz-input-icon-end"
                    placeholder={mode === "signup" ? "En az 6 karakter" : "••••••••"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 z-[1] -translate-y-1/2 text-[var(--mz-faint)] transition hover:text-[var(--mz-text)]"
                    aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {mode === "signup" ? (
                  <>
                    <div className="mt-3 flex gap-1.5">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-colors",
                            i < score
                              ? score <= 1
                                ? "bg-[var(--mz-warn)]"
                                : score === 2
                                  ? "bg-amber-400"
                                  : "bg-[var(--mz-ok)]"
                              : "bg-[var(--mz-border)]"
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-[var(--mz-faint)]">
                      {password
                        ? score <= 1
                          ? "Zayıf şifre"
                          : score === 2
                            ? "Orta güçlük"
                            : "Güçlü şifre"
                        : "Büyük/küçük harf ve rakam önerilir"}
                    </p>
                  </>
                ) : null}
              </label>

              {mode === "signup" ? (
                <div className="flex items-start gap-3 rounded-xl border border-[var(--mz-border)] bg-[var(--mz-surface-2)] px-4 py-3.5">
                  <Check size={15} className="mt-0.5 shrink-0 text-[var(--mz-ok)]" />
                  <p className="text-xs leading-relaxed text-[var(--mz-muted)]">
                    Kayıt olarak <span className="text-[var(--mz-text)]">Recep Usta Mağaza</span>{" "}
                    üzerinden sipariş verebilir ve müşteri paneline erişebilirsiniz.
                  </p>
                </div>
              ) : null}

              {error ? (
                <p className="rounded-xl border border-[color-mix(in_srgb,var(--mz-warn)_35%,transparent)] bg-[color-mix(in_srgb,var(--mz-warn)_10%,transparent)] px-4 py-3 text-sm text-[var(--mz-warn)]">
                  {error}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mz-btn mz-btn-primary mt-7 w-full py-3.5 text-[0.95rem]"
            >
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {mode === "login" ? "Giriş yapılıyor…" : "Hesap oluşturuluyor…"}
                </span>
              ) : (
                <>
                  {mode === "login" ? "Giriş yap" : "Hesabı oluştur"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  icon: typeof User;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mz-label">{label}</span>
      <div className="relative">
        <Icon size={15} className="mz-field-icon" />
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="mz-input mz-input-icon"
        />
      </div>
    </label>
  );
}

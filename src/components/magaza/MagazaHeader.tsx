import Link from "next/link";
import { ShieldCheck, Headphones, Zap, Lock } from "lucide-react";
import { getCustomerAuthState, customerLogoutAction } from "@/app/magaza/actions";

export async function MagazaHeader() {
  const auth = await getCustomerAuthState();
  const name = [auth.client?.firstname, auth.client?.lastname].filter(Boolean).join(" ");

  return (
    <header className="pb-10 pt-28 md:pb-14 md:pt-32">
      <div className="mz-container">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-medium text-[var(--mz-muted)]">
            Recep Usta <span className="text-[var(--mz-faint)]">/</span> Cloud Infrastructure
          </p>
          {auth.authenticated ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-[var(--mz-muted)]">
                {name || auth.client?.email}
              </span>
              <Link href="/portal" className="mz-btn mz-btn-ghost">
                Müşteri paneli
              </Link>
              <form action={customerLogoutAction}>
                <button type="submit" className="mz-btn mz-btn-ghost">
                  Çıkış
                </button>
              </form>
            </div>
          ) : null}
        </div>

        <div className="max-w-3xl">
          <span className="mz-kicker">Premium hosting · Domain · Cloud</span>
          <h1 className="mz-title mt-5 text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Güvenilir altyapı.
            <br />
            <span className="bg-gradient-to-r from-[var(--mz-brand)] to-[var(--mz-brand-2)] bg-clip-text text-transparent">
              Şeffaf fiyat.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--mz-muted)] md:text-lg">
            Domain sorgulayın, hosting ve sunucu paketlerini özellikleriyle karşılaştırın.
            Satış burada — ödeme güvenli ödeme sayfasında tamamlanır.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#domain-sorgu" className="mz-btn mz-btn-primary">
              Domain sorgula
            </a>
            <a href="#hosting-paketleri" className="mz-btn mz-btn-ghost">
              Paketleri gör
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Zap, label: "NVMe performans" },
            { icon: ShieldCheck, label: "DDoS koruması" },
            { icon: Lock, label: "Ücretsiz SSL" },
            { icon: Headphones, label: "7/24 destek" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-[var(--mz-border)] bg-[var(--mz-surface)]/70 px-4 py-3"
            >
              <Icon size={18} className="text-[var(--mz-brand-2)]" />
              <span className="text-sm font-medium text-[var(--mz-text)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

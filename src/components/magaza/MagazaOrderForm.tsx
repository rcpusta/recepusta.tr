"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { placeProductOrderAction } from "@/app/magaza/actions";
import type { DchostPeriod } from "@/lib/dchost/types";
import { formatPrice, periodLabel } from "@/lib/dchost/format";

export function MagazaOrderForm({
  productId,
  productHref,
  productName,
  periods,
  needsDomain,
  authenticated,
}: {
  productId: string;
  productHref: string;
  productName: string;
  periods: DchostPeriod[];
  needsDomain: boolean;
  authenticated: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const defaultCycle = periods.find((p) => p.selected)?.value || periods[0]?.value || "m";

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!authenticated) {
      router.push(`/magaza/hesap?mode=login&next=${encodeURIComponent(productHref)}`);
      return;
    }

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await placeProductOrderAction(formData);
      if (!result.ok) {
        if (result.redirectTo?.includes("/magaza/hesap") || result.redirectTo?.includes("/magaza/giris")) {
          router.push(result.redirectTo);
          return;
        }
        setError(result.error);
        return;
      }
      if (result.redirectTo) {
        window.location.href = result.redirectTo;
        return;
      }
      router.push("/portal/faturalar");
    });
  }

  return (
    <form onSubmit={onSubmit} className="mz-card p-6 md:p-7">
      <input type="hidden" name="productId" value={productId} />
      <span className="mz-kicker">Order</span>
      <h2 className="mz-title mt-3 text-2xl">{productName}</h2>
      <p className="mt-2 text-sm text-[var(--mz-muted)]">
        Ödeme güvenli ödeme sayfasında açılır. Kart bilgisi bu sitede tutulmaz.
      </p>

      <div className="mt-6 space-y-4">
        {periods.length ? (
          <label className="block">
            <span className="mz-label">Dönem</span>
            <select name="cycle" defaultValue={defaultCycle} className="mz-input">
              {periods.map((p) => (
                <option key={p.value} value={p.value}>
                  {periodLabel(p.value)} — {formatPrice(p.price)}
                  {p.setup ? ` + kurulum ${formatPrice(p.setup)}` : ""}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <input type="hidden" name="cycle" value="m" />
        )}

        {needsDomain ? (
          <label className="block">
            <span className="mz-label">Domain</span>
            <input name="domain" placeholder="ornek.com" required className="mz-input" />
          </label>
        ) : null}

        <label className="block">
          <span className="mz-label">Promosyon</span>
          <input name="promocode" placeholder="Opsiyonel" className="mz-input" />
        </label>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-[var(--mz-warn)]">{error}</p>
      ) : null}

      {!authenticated ? (
        <p className="mt-5 text-sm text-[var(--mz-muted)]">
          Devam için{" "}
          <Link
            href={`/magaza/hesap?mode=login&next=${encodeURIComponent(productHref)}`}
            className="font-medium text-[var(--mz-brand-2)] underline"
          >
            giriş
          </Link>{" "}
          veya{" "}
          <Link href="/magaza/hesap?mode=signup" className="font-medium text-[var(--mz-brand-2)] underline">
            kayıt
          </Link>
          .
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="mz-btn mz-btn-primary mt-6 w-full">
        {pending
          ? "Sipariş oluşturuluyor…"
          : authenticated
            ? "Sipariş ver · Ödemeye geç"
            : "Giriş yapıp devam et"}
      </button>
    </form>
  );
}

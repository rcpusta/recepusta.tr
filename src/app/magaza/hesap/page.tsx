import { Suspense } from "react";
import type { Metadata } from "next";
import { MagazaAtmosphere } from "@/components/magaza/MagazaAtmosphere";
import { MagazaAuthForm } from "@/components/magaza/MagazaAuthForm";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Hesap",
  description: "Mağaza hesabına giriş yapın veya yeni hesap oluşturun.",
  path: "/magaza/hesap",
});

type Props = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function MagazaHesapPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialMode =
    params.mode === "signup" || params.mode === "kayit" ? "signup" : "login";

  return (
    <MagazaAtmosphere>
      <div className="mz-container flex min-h-[85vh] items-center py-24 md:py-28">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-5xl rounded-[1.5rem] border border-[var(--mz-border)] bg-[var(--mz-surface)] p-10 text-center text-sm text-[var(--mz-muted)]">
              Yükleniyor…
            </div>
          }
        >
          <MagazaAuthForm initialMode={initialMode} />
        </Suspense>
      </div>
    </MagazaAtmosphere>
  );
}

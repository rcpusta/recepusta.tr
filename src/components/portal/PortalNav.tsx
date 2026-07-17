import Link from "next/link";
import { customerLogoutAction } from "@/app/magaza/actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/portal", label: "Özet", exact: true },
  { href: "/portal/servisler", label: "Servisler" },
  { href: "/portal/faturalar", label: "Faturalar" },
  { href: "/portal/destek", label: "Destek" },
  { href: "/portal/domainler", label: "Domainler" },
  { href: "/portal/ssl", label: "SSL" },
  { href: "/portal/dns", label: "DNS" },
];

export function PortalNav({ pathname }: { pathname: string }) {
  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">Client Area</p>
        <h2 className="mt-2 font-heading text-xl">Müşteri Paneli</h2>
        <nav className="mt-5 space-y-1">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm transition",
                  active
                    ? "border border-cyan-400/25 bg-cyan-400/10 text-cyan-100"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
          <Link href="/magaza" className="block text-sm text-cyan-300/80 hover:underline">
            Mağazaya dön
          </Link>
          <form action={customerLogoutAction}>
            <button type="submit" className="text-sm text-white/45 hover:text-white">
              Çıkış yap
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

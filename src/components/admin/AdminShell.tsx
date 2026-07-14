"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LogOut, Newspaper, LayoutDashboard, Activity, Ticket, Share2, KeyRound } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { adminLogoutAction } from "@/app/admin/login/actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/tickets", label: "Ticketlar", icon: Ticket },
  { href: "/admin/settings", label: "İletişim & Sosyal", icon: Share2 },
  { href: "/admin/password", label: "Şifre değiştir", icon: KeyRound },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/news", label: "Haberler", icon: Newspaper },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    try {
      await adminLogoutAction();
    } catch {
      // Cookie clear may still fail on network errors; still leave the panel UI.
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#050a12] text-white" style={{ cursor: "auto" }}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.12),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.12),_transparent_45%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />

      <div className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col gap-6 px-4 py-5 md:flex-row md:px-6 lg:px-8">
        <aside className="w-full shrink-0 md:w-64">
          <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1220]/85 p-5 shadow-[0_0_50px_rgba(34,211,238,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <Logo href="/admin" size="md" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-1 text-[10px] uppercase tracking-wider text-emerald-300">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                Online
              </span>
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
              Command Center
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-white/40">
              <Activity size={12} className="text-cyan-400" />
              Recep Usta Ops
            </div>

            <nav className="mt-6 space-y-1">
              {links.map((link) => {
                const active = link.exact
                  ? pathname === link.href
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                      active
                        ? "border border-cyan-400/25 bg-cyan-400/10 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                        : "border border-transparent text-white/55 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={logout}
              className="mt-6 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut size={16} />
              Çıkış
            </button>
            <Link
              href="/"
              className="mt-2 block px-3 text-xs text-white/30 transition hover:text-white/70"
            >
              Siteye dön →
            </Link>
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-10">{children}</main>
      </div>
    </div>
  );
}

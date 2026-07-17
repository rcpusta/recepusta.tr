"use client";

import { usePathname } from "next/navigation";
import { PortalNav } from "@/components/portal/PortalNav";

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="section-padding pt-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
        <PortalNav pathname={pathname} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

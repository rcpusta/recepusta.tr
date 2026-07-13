import { getSiteSettings } from "@/lib/site-settings-store";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-medium">İletişim & Sosyal</h1>
        <p className="mt-1 text-sm text-white/50">
          Contact bölümü, footer ve menüdeki WhatsApp / sosyal medya linklerini buradan yönet.
        </p>
      </div>
      <SiteSettingsForm initial={settings} />
    </div>
  );
}

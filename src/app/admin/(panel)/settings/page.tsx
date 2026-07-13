import { getSiteSettings } from "@/lib/site-settings-store";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-medium">Ayarlar</h1>
        <p className="mt-1 text-sm text-white/50">
          İletişim bilgileri, sosyal linkler ve admin şifresi.
        </p>
      </div>

      <ChangePasswordForm />

      <div>
        <h2 className="mb-4 font-heading text-xl font-medium">İletişim & Sosyal</h2>
        <SiteSettingsForm initial={settings} />
      </div>
    </div>
  );
}

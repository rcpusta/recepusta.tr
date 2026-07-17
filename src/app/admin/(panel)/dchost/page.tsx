import { getDchostSettingsPublic } from "@/lib/dchost-settings-store";
import { DchostSettingsForm } from "@/components/admin/DchostSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminDchostSettingsPage() {
  const settings = await getDchostSettingsPublic();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-medium">DCHost Ayarları</h1>
        <p className="mt-1 text-sm text-white/50">
          Mağaza vitrini için API adresi ve client area hesabını buradan yönet.
        </p>
      </div>
      <DchostSettingsForm initial={settings} />
    </div>
  );
}

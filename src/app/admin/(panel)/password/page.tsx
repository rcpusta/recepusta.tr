import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default function AdminPasswordPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-medium">Şifre değiştir</h1>
        <p className="mt-1 text-sm text-white/50">
          Admin paneli giriş şifresini güncelle. En az 8 karakter olmalı.
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}

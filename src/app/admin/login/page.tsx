import { Suspense } from "react";
import AdminLoginPage from "./LoginClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b14]" />}>
      <AdminLoginPage />
    </Suspense>
  );
}

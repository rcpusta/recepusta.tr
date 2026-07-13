"use client";

export async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Yükleme başarısız");
  return data.url as string;
}

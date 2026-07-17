import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MagazaKayitRedirect({ searchParams }: Props) {
  const params = await searchParams;
  const q = new URLSearchParams();
  q.set("mode", "signup");
  for (const [key, value] of Object.entries(params)) {
    if (key === "mode") continue;
    if (typeof value === "string") q.set(key, value);
    else if (Array.isArray(value) && value[0]) q.set(key, value[0]);
  }
  redirect(`/magaza/hesap?${q.toString()}`);
}

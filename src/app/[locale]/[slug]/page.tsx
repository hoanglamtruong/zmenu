import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ table?: string }>;
};

export default async function SlugRedirectPage({
  params,
  searchParams,
}: Props) {
  const { locale, slug } = await params;
  const { table } = await searchParams;

  const qs = new URLSearchParams({ tenant_id: slug });
  if (table) qs.set("table_id", table);

  redirect(`/${locale}/menu?${qs.toString()}`);
}

import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/menu?tenant_id=demo-fnb`);
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Props = { params: Promise<{ locale: string }> };

export default async function StaffPage({ params }: Props) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/auth/login?role=staff`);
  }
  redirect(`/${locale}/staff/orders`);
}

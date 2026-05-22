import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ReportsView } from "@/components/dashboard/ReportsView";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminReportsPage({ params }: Props) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/auth/login?role=admin`);
  }
  return <ReportsView locale={locale} />;
}

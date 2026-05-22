import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OverviewView } from "@/components/dashboard/OverviewView";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminOverviewPage({ params }: Props) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/auth/login?role=admin`);
  }
  return <OverviewView locale={locale} />;
}

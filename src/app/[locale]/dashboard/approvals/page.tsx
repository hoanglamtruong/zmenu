import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApprovalsView } from "@/components/dashboard/ApprovalsView";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminApprovalsPage({ params }: Props) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/auth/login?role=admin`);
  }
  return <ApprovalsView locale={locale} />;
}

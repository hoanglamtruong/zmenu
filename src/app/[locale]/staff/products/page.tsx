import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StaffProductsView } from "@/components/staff/StaffProductsView";

type Props = { params: Promise<{ locale: string }> };

export default async function StaffProductsPage({ params }: Props) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    (session.user.role !== "staff" && session.user.role !== "admin")
  ) {
    redirect(`/${locale}/auth/login?role=staff`);
  }
  return <StaffProductsView locale={locale} />;
}

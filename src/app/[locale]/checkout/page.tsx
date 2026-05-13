import { CheckoutView } from "@/components/checkout/CheckoutView";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tenant_id?: string; table_id?: string }>;
};

export default async function CheckoutPage({ params, searchParams }: Props) {
  await params;
  const { tenant_id, table_id } = await searchParams;
  return (
    <CheckoutView tenantId={tenant_id ?? "demo"} tableId={table_id ?? null} />
  );
}

import { OrderStatusView } from "@/components/order-status/OrderStatusView";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order_id?: string }>;
};

export default async function OrderStatusPage({
  params,
  searchParams,
}: Props) {
  await params;
  const { order_id } = await searchParams;
  return <OrderStatusView orderId={order_id ?? ""} />;
}

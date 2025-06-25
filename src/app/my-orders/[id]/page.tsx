
import { OrderDetail } from '@/features/order/components/OrderDetail';

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) {
    return (
      <div className="min-h-screen bg-[#f8f7f3]/80 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-metal text-2xl mb-4">Invalid Order ID</h1>
          <p className="font-gothic text-gray-600">The order ID provided is not valid.</p>
        </div>
      </div>
    );
  }

  return <OrderDetail orderId={orderId} />;
}

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAdminAwaitingReleaseTransactions, releaseEscrowByAdmin } from '@/features/order/services';
import { toast } from 'sonner';

export default function EscrowAwaitingReleaseManager() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [releasingId, setReleasingId] = useState<number | null>(null);

  const fetchTransactions = () => {
    setLoading(true);
    setError(null);
    getAdminAwaitingReleaseTransactions()
      .then((res) => {
        setTransactions(res.data?.content || res.data || []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message || 'Error fetching transactions');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRelease = async (transactionId: number) => {
    if (!window.confirm('Are you sure you want to release escrow for this transaction?')) return;
    setReleasingId(transactionId);
    try {
      await releaseEscrowByAdmin(transactionId);
      toast.success('Escrow released successfully!');
      fetchTransactions();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to release escrow');
    } finally {
      setReleasingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Escrow Awaiting Release</h2>
        <p className="text-sm text-gray-500">Manage transactions that are awaiting admin escrow release</p>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 py-8 text-center">{error}</div>
          ) : !transactions.length ? (
            <div className="text-center py-8 text-gray-500">No transactions found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Escrow Status</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Platform Fee</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Amount</th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered At</th>
                  <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">{tx.transactionId}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{tx.orderId}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{tx.productTitle || tx.productName || '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{tx.buyerUsername || '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{tx.sellerUsername || '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{tx.amount?.toLocaleString('vi-VN') || '-'}</td>
                    <td className="py-4 px-6">
                      <Badge variant={tx.escrowStatus === 'RELEASED' ? 'default' : 'secondary'}>{tx.escrowStatus}</Badge>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{tx.paymentMethod || '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{tx.platformFee?.toLocaleString('vi-VN') || '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{tx.sellerAmount?.toLocaleString('vi-VN') || '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{tx.deliveredAt ? new Date(tx.deliveredAt).toLocaleString('vi-VN') : '-'}</td>
                    <td className="py-4 px-6 text-right">
                      <Button size="sm" variant="outline" onClick={() => handleRelease(tx.transactionId)} disabled={releasingId === tx.transactionId}>
                        {releasingId === tx.transactionId ? 'Releasing...' : 'Release'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
} 
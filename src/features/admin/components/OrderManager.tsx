import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  getAdminTransactions,
  getAdminProblemTransactions,
  getAdminOrderTimeline,
  getAdminExportOrders,
  getAdminSellerAnalytics,
  getAdminBuyerAnalytics,
  getAdminAllOrders,
} from '@/features/order/services';

const orderTabs = [
  { id: 'transactions', label: 'Transactions' },
  { id: 'problems', label: 'Problem Transactions' },
  { id: 'buyers', label: 'Buyer Analytics' },
  { id: 'all', label: 'All Orders' },
];

const tabServiceMap: Record<string, any> = {
  transactions: getAdminTransactions,
  problems: getAdminProblemTransactions,
  buyers: getAdminBuyerAnalytics,
  all: getAdminAllOrders,
};

const PRIORITY_KEYS = [
  'transactionId', 'orderId', 'status', 'totalAmount', 'amount', 'createdAt', 'paidAt', 'deliveredAt',
  'trackingNumber', 'buyerProtectionEligible', 'platformFee', 'feePercentage', 'productTitle', 'customer', 'seller', 'buyer',
];

function formatValue(key: string, value: any) {
  if (key === 'status' || key === 'escrowStatus' || key === 'disputeStatus') {
    return (
      <span
        className="font-bold uppercase tracking-wide text-xs"
        style={{ color: '#000' }}
      >
        {value}
      </span>
    );
  }
  if (typeof value === 'number' && (key.toLowerCase().includes('amount') || key.toLowerCase().includes('fee') || key.toLowerCase().includes('price'))) {
    return value.toLocaleString('vi-VN');
  }
  if (key.toLowerCase().includes('date') || (key.toLowerCase().includes('at') && key !== 'status' && key !== 'escrowStatus' && key !== 'disputeStatus')) {
    return value ? new Date(value).toLocaleString() : '';
  }
  if (typeof value === 'object' && value !== null) {
    if (value.username) return value.username;
    return JSON.stringify(value);
  }
  return String(value ?? '');
}

function getTableColumns(data: any[]): string[] {
  if (!Array.isArray(data) || data.length === 0) return [];
  const allKeys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
  const columns = PRIORITY_KEYS.filter(k => allKeys.includes(k)).concat(allKeys.filter(k => !PRIORITY_KEYS.includes(k)));
  return columns.slice(0, 8);
}

export default function OrderManager() {
  const [activeTab, setActiveTab] = React.useState('transactions');
  const [timelineOrderId, setTimelineOrderId] = React.useState('1');
  const [search, setSearch] = React.useState('');
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    setData(null);
    const service = tabServiceMap[activeTab];
    let promise;
    if (activeTab === 'timeline') {
      promise = service(timelineOrderId);
    } else {
      promise = service();
    }
    promise
      .then((res: any) => {
        if (!ignore) setData(res);
      })
      .catch((err: any) => {
        if (!ignore) setError(err?.response?.data?.message || err.message || 'Error');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, [activeTab, timelineOrderId]);

  let arrayData = null;
  if (Array.isArray(data)) {
    arrayData = data;
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.content)) {
      arrayData = data.content;
    } else if (data.data && Array.isArray(data.data.content)) {
      arrayData = data.data.content;
    }
  }

  const columns = arrayData && Array.isArray(arrayData) && arrayData.length > 0 && typeof arrayData[0] === 'object'
    ? getTableColumns(arrayData)
    : [];

  const filteredData = search && arrayData
    ? arrayData.filter((row: Record<string, any>) => columns.some(col => String(row[col] ?? '').toLowerCase().includes(search.toLowerCase())))
    : arrayData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-2">
        <div className="flex gap-2">
          {orderTabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-t font-semibold border-b-2 transition-colors duration-150 ${activeTab === tab.id ? 'border-black text-black bg-white' : 'border-transparent text-gray-500 bg-gray-50'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-auto flex justify-end">
          <Input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </div>
      <Card className="p-6">
        <div className="text-lg font-semibold mb-2">{orderTabs.find(t => t.id === activeTab)?.label}</div>
        {activeTab === 'timeline' && (
          <div className="mb-4">
            <label className="mr-2">Order ID:</label>
            <input
              type="number"
              min="1"
              value={timelineOrderId}
              onChange={e => setTimelineOrderId(e.target.value)}
              className="border px-2 py-1 rounded w-24"
            />
          </div>
        )}
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  {columns.map(col => (
                    <th
                      key={col}
                      className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData && filteredData.length > 0 ? filteredData.map((row: Record<string, any>, i: number) => (
                  <tr key={i} className="hover:bg-gray-50 border-b border-gray-100">
                    {columns.map(col => (
                      <td
                        key={col}
                        className={`py-4 px-6 text-center ${col === 'status' ? 'font-bold' : ''}`}
                      >
                        {formatValue(col, row[col])}
                      </td>
                    ))}
                    <td className="py-4 px-6 text-center">
                      <button className="text-blue-600 hover:underline text-xs font-semibold">View Detail</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={columns.length + 1} className="text-center py-8 text-gray-500">No data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
} 
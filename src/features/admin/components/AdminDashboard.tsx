"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  ShoppingBag, 
  FileText, 
  BarChart3,
  Tag,
  Briefcase,
  Bell,
  User,
  LogOut
} from "lucide-react";
import CategoryManager from "./CategoryManager";
import BrandManager from "./BrandManager";
import ProductManager from "./ProductManager";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  // getAdminTransactionAnalytics,
  getAdminOrderStatistics,
  // getAdminRevenueAnalytics
} from '@/features/order/services';
import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger, TabsContent as UITabsContent } from "@/components/ui/tabs";
import UserManager from './UserManager';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useAdminOrders } from '../hooks/useAdminOrders';
import Pagination from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { getAdminAwaitingReleaseTransactions } from '@/features/order/services';
import { releaseEscrowByAdmin } from '@/features/order/services';
import { toast } from 'sonner';
import EscrowAwaitingReleaseManager from './EscrowAwaitingReleaseManager';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ORDER_STATUSES = [
  { value: "ALL", label: "All Orders" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "EXPIRED", label: "Expired" }
];

function AdminAllOrdersTable({ onShowDetail }: { onShowDetail: (order: any) => void }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Use admin orders hook with pagination
  const { ordersQuery } = useAdminOrders(
    currentPage, 
    pageSize, 
    statusFilter === "ALL" ? undefined : statusFilter
  );

  // Extract data from query
  const orders = Array.isArray(ordersQuery.data?.content) ? ordersQuery.data.content : [];
  const totalPages = ordersQuery.data?.pagination?.totalPages || 1;
  const totalElements = ordersQuery.data?.pagination?.totalElements || 0;

  // Handle status filter change
  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  if (ordersQuery.isLoading) return <div className="p-4 text-center">Loading order list...</div>;
  if (ordersQuery.error) return <div className="p-4 text-center text-red-500">{ordersQuery.error?.message || 'Error fetching orders'}</div>;

  return (
    <div className="space-y-6"> {/* Increased space-y from 4 to 6 */}
      {/* Status Tabs */}
      <div className="border-b border-gray-200">
        <UITabs value={statusFilter} onValueChange={handleStatusChange}>
          <UITabsList className="flex flex-wrap gap-2 mb-4">
            {ORDER_STATUSES.map((status) => (
              <UITabsTrigger
                key={status.value}
                value={status.value}
                className="px-6 py-3 text-sm font-medium rounded-lg"
              >
                {status.label}
                {statusFilter === status.value && totalElements > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {totalElements}
                  </Badge>
                )}
              </UITabsTrigger>
            ))}
          </UITabsList>
        </UITabs>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg"> {/* Added rounded-lg */}
        <table className="min-w-full border rounded-xl shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-xs font-bold text-gray-700 uppercase">ID</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-700 uppercase">Status</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-700 uppercase">Amount</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-700 uppercase">Items</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-700 uppercase">Created At</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-700 uppercase">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No orders found for the selected status.
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm">{order.orderId}</td>
                  <td className="py-4 px-6 text-sm">{order.status}</td>
                  <td className="py-4 px-6 text-sm">{order.totalAmount?.toLocaleString('vi-VN') || '-'}</td>
                  <td className="py-4 px-6 text-sm">{order.totalItems}</td>
                  <td className="py-4 px-6 text-sm">{order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '-'}</td>
                  <td className="py-4 px-6">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="hover:bg-gray-100" 
                      onClick={() => onShowDetail(order)}
                    >
                      View Detail
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage + 1} // Convert to 1-based for UI
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page - 1)} // Convert back to 0-based
          />
        </div>
      )}
    </div>
  );
}

function AdminAwaitingReleaseTable() {
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
  );
}

// Mock data for the dashboard
const mockStats = [
  { title: "Total Users", value: "2,451", icon: Users, change: "+12.5%" },
  { title: "Total Orders", value: "1,234", icon: ShoppingBag, change: "+8.2%" },
  { title: "Total Products", value: "856", icon: FileText, change: "+5.7%" },
  { title: "Revenue", value: "$45,678", icon: BarChart3, change: "+15.3%" },
];

const mockRecentOrders = [
  { id: "ORD001", customer: "John Doe", product: "Designer Jacket", amount: "$299", status: "Completed" },
  { id: "ORD002", customer: "Jane Smith", product: "Limited Edition Bag", amount: "$599", status: "Processing" },
  { id: "ORD003", customer: "Mike Johnson", product: "Custom Sneakers", amount: "$199", status: "Shipped" },
  { id: "ORD004", customer: "Sarah Wilson", product: "Premium Watch", amount: "$899", status: "Pending" },
];

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "brands", label: "Brands", icon: Briefcase },
  { id: "all-products", label: "All Product", icon: FileText },
  { id: "user-management", label: "User Management", icon: Users },
  { id: "awaiting-release", label: "Escrow Awaiting Release", icon: Bell },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const { logout, isLoggingOut } = useAuth();

  useEffect(() => {
    if (activeTab !== 'overview') return;
    setLoading(true);
    setError(null);
    getAdminOrderStatistics()
      .then((orderStatistics) => {
        setStats({ orderStatistics });
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message || 'Error fetching statistics');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab]);

  // Chuẩn bị dữ liệu cho PieChart trạng thái đơn hàng
  const statusData = stats && stats.orderStatistics && stats.orderStatistics.data.statusBreakdown
    ? Object.entries(stats.orderStatistics.data.statusBreakdown).map(([key, value]) => ({
        name: key,
        value: value as number,
      }))
    : [];
  // Thay PIE_COLORS bằng map màu theo trạng thái
  const STATUS_COLOR_MAP = {
    PENDING: "#0088FE",           // xanh dương
    PROCESSING: "#00C49F",        // xanh ngọc
    OUT_FOR_DELIVERY: "#FFBB28",  // vàng
    DELIVERED: "#A28FD0",         // tím
    CANCELLED: "#FF8042",         // cam
    REFUNDED: "#FF6666",          // đỏ
    EXPIRED: "#A9A9A9"            // xám
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "categories":
        return <CategoryManager />;
      case "brands":
        return <BrandManager />;
      case "all-products":
        return <ProductManager />;
      case "user-management":
        return <UserManager />;
      case "awaiting-release":
        return <EscrowAwaitingReleaseManager />;
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <Card key={idx} className="p-6 animate-pulse h-32" />
                ))
              ) : error ? (
                <div className="col-span-4 text-red-500">{error}</div>
              ) : stats ? ([
                {
                  title: "Total Orders",
                  value: stats.orderStatistics?.data?.totalOrders ?? 0,
                  icon: ShoppingBag,
                },
                {
                  title: "Today Orders",
                  value: stats.orderStatistics?.data?.todayOrders ?? 0,
                  icon: ShoppingBag,
                },
                {
                  title: "Total Revenue",
                  value: (stats.orderStatistics?.data?.totalRevenue?.toLocaleString('vi-VN') ?? 0) + ' VND',
                  icon: BarChart3,
                },
                {
                  title: "Platform Fees Collected",
                  value: (stats.orderStatistics?.data?.platformFeesCollected?.toLocaleString('vi-VN') ?? 0) + ' VND',
                  icon: BarChart3,
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <stat.icon className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                  </Card>
                </motion.div>
              ))) : null}
            </div>
            {/* BarChart: Trạng thái đơn hàng */}
            {stats && statusData.length > 0 ? (
              <Card className="p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Order count by status</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Order">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLOR_MAP[entry.name as keyof typeof STATUS_COLOR_MAP] || "#8884d8"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            ) : (
              <Card className="p-6 mb-8 text-center text-gray-500">No order status data to display chart</Card>
            )}
            {/* Thêm AdminAllOrdersTable dưới BarChart */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">All Orders</h3>
              <AdminAllOrdersTable onShowDetail={(order) => { setSelectedOrder(order); setShowDetail(true); }} />
            </Card>
            {showDetail && selectedOrder && (
              <Dialog open={showDetail} onOpenChange={(open) => { setShowDetail(open); if (!open) setSelectedOrder(null); }}>
                <DialogContent className="sm:max-w-[1100px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Order Detail #{selectedOrder.orderId}</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col sm:flex-row gap-12">
                    {/* Product image (first item) + Order Items */}
                    <div className="flex-shrink-0 flex flex-col items-center w-full sm:w-[400px]">
                      {selectedOrder.itemSummaries && selectedOrder.itemSummaries[0]?.productImage ? (
                        <img
                          src={selectedOrder.itemSummaries[0].productImage}
                          alt={selectedOrder.itemSummaries[0].productTitle}
                          className="w-[350px] h-[350px] object-cover rounded border mb-4"
                        />
                      ) : (
                        <div className="w-[350px] h-[350px] flex items-center justify-center bg-gray-100 rounded border text-gray-400 mb-4">No Image</div>
                      )}
                      {/* Order Items ngay dưới ảnh */}
                      {Array.isArray(selectedOrder.itemSummaries) && selectedOrder.itemSummaries.length > 0 && (
                        <div className="w-full border-t pt-3">
                          <div className="text-base font-semibold mb-2">Order Items:</div>
                          <div className="flex flex-col gap-3">
                            {selectedOrder.itemSummaries.map((item: any, idx: number) => (
                              <div key={item.orderItemId || idx} className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700 py-1">
                                {Object.entries(item)
                                  .filter(([key]) => key !== 'productImage')
                                  .map(([key, value]) => (
                                    <span key={key} className="mr-2">
                                      <span className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> <span className="font-normal">{
                                        typeof value === 'number' ? value.toLocaleString('en-US') :
                                        typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                        (value === null || value === undefined || value === '') ? '-' :
                                        (typeof value === 'object' ? JSON.stringify(value) : String(value))
                                      }</span>
                                    </span>
                                  ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Order info tổng quan */}
                    <div className="flex-1 flex flex-col gap-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Order #{selectedOrder.orderId}</h3>
                        <div className="text-gray-700 text-base mb-2 whitespace-pre-line">Status: <span className="font-semibold">{selectedOrder.status}</span></div>
                      </div>
                      {/* Show all root fields except itemSummaries */}
                      <div className="border-t pt-3 grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-700">
                        {Object.entries(selectedOrder)
                          .filter(([key, _]) => key !== 'itemSummaries' && key !== 'orderId' && key !== 'buyer')
                          .map(([key, value]) => (
                            <div key={key} className="flex flex-col mb-1">
                              <span className="font-semibold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                              <span className="break-all text-gray-900 text-base font-semibold">{
                                typeof value === 'number' && /amount|price|fee|total|revenue|value/i.test(key)
                                  ? value.toLocaleString('vi-VN') + ' VND'
                                  : typeof value === 'number'
                                    ? value.toLocaleString('en-US')
                                    : typeof value === 'boolean' ? (value ? 'Yes' : 'No')
                                    : (value === null || value === undefined || value === '') ? '-' 
                                    : (typeof value === 'object' ? JSON.stringify(value) : String(value))
                              }</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <h1 className="font-metal text-3xl tracking-wider uppercase inline-block relative">
                  <span className="text-black">VES</span>
                  <span className="text-red-900">TIGE</span>
                  <span className="absolute -top-1 -right-1 text-red-900 text-[8px]">®</span>
                </h1>
            </div>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab}>
            {renderTabContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
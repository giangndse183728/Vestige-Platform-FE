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
  User
} from "lucide-react";
import CategoryManager from "./CategoryManager";
import BrandManager from "./BrandManager";
import ProductManager from "./ProductManager";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import OrderManager from './OrderManager';
import {
  getAdminTransactionAnalytics,
  getAdminOrderStatistics,
  getAdminRevenueAnalytics
} from '@/features/order/services';
import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger, TabsContent as UITabsContent } from "@/components/ui/tabs";
import UserManager from './UserManager';

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
  { id: "order-management", label: "Order Management", icon: ShoppingBag },
  { id: "user-management", label: "User Management", icon: Users },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== 'overview') return;
    setLoading(true);
    setError(null);
    Promise.all([
      getAdminTransactionAnalytics(),
      getAdminOrderStatistics(),
      getAdminRevenueAnalytics()
    ]).then(([transactionAnalytics, orderStatistics, revenueAnalytics]) => {
      setStats({ transactionAnalytics, orderStatistics, revenueAnalytics });
    }).catch((err) => {
      setError(err?.response?.data?.message || err.message || 'Error fetching analytics');
    }).finally(() => {
      setLoading(false);
    });
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "categories":
        return <CategoryManager />;
      case "brands":
        return <BrandManager />;
      case "all-products":
        return <ProductManager />;
      case "order-management":
        return <OrderManager />;
      case "user-management":
        return <UserManager />;
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {loading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <Card key={idx} className="p-6 animate-pulse h-32" />
                ))
              ) : error ? (
                <div className="col-span-4 text-red-500">{error}</div>
              ) : stats ? ([
                {
                  title: "Total Transactions",
                  value: stats.transactionAnalytics?.data?.totalTransactions ?? 0,
                  icon: ShoppingBag,
                },
                {
                  title: "Total Volume",
                  value: stats.transactionAnalytics?.data?.totalVolume?.toLocaleString('vi-VN') ?? 0,
                  icon: BarChart3,
                },
                {
                  title: "Total Revenue",
                  value: stats.revenueAnalytics?.data?.totalRevenue?.toLocaleString('vi-VN') ?? 0,
                  icon: BarChart3,
                },
                {
                  title: "Today Orders",
                  value: stats.orderStatistics?.data?.todayOrders ?? 0,
                  icon: ShoppingBag,
                },
                {
                  title: "Total Orders",
                  value: stats.orderStatistics?.data?.totalOrders ?? 0,
                  icon: ShoppingBag,
                },
                {
                  title: "Avg Transaction Value",
                  value: stats.transactionAnalytics?.data?.avgTransactionValue?.toLocaleString('vi-VN') ?? 0,
                  icon: BarChart3,
                },
                {
                  title: "Dispute Rate",
                  value: (stats.transactionAnalytics?.data?.disputeRate * 100 || 0).toFixed(2) + '%',
                  icon: Bell,
                },
                {
                  title: "Paid Orders",
                  value: stats.orderStatistics?.data?.statusBreakdown?.PAID ?? 0,
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
            {/* Card tổng hợp breakdown dạng tab */}
            {stats && (
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Platform Status</h3>
                <UITabs defaultValue="order" className="w-full">
                  <UITabsList className="mb-4">
                    <UITabsTrigger value="order">Order Status</UITabsTrigger>
                    <UITabsTrigger value="transaction">Transaction Status</UITabsTrigger>
                    <UITabsTrigger value="escrow">Escrow Status</UITabsTrigger>
                  </UITabsList>
                  <UITabsContent value="order">
                    <table className="min-w-full border rounded-xl shadow-sm overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-xs font-bold text-gray-700 text-center uppercase tracking-wider">Status</th>
                          <th className="py-3 px-4 text-xs font-bold text-gray-700 text-center uppercase tracking-wider">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.orderStatistics?.data?.statusBreakdown && Object.entries(stats.orderStatistics.data.statusBreakdown).map(([key, value]) => (
                          <tr key={key} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                            <td className="py-3 px-4 text-center capitalize">{key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</td>
                            <td className="py-3 px-4 text-center font-bold">{value as any}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </UITabsContent>
                  <UITabsContent value="transaction">
                    <table className="min-w-full border rounded-xl shadow-sm overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-xs font-bold text-gray-700 text-center uppercase tracking-wider">Status</th>
                          <th className="py-3 px-4 text-xs font-bold text-gray-700 text-center uppercase tracking-wider">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.transactionAnalytics?.data?.transactionStatusBreakdown && Object.entries(stats.transactionAnalytics.data.transactionStatusBreakdown).map(([key, value]) => (
                          <tr key={key} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                            <td className="py-3 px-4 text-center capitalize">{key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</td>
                            <td className="py-3 px-4 text-center font-bold">{value as any}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </UITabsContent>
                  <UITabsContent value="escrow">
                    <table className="min-w-full border rounded-xl shadow-sm overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-xs font-bold text-gray-700 text-center uppercase tracking-wider">Status</th>
                          <th className="py-3 px-4 text-xs font-bold text-gray-700 text-center uppercase tracking-wider">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.transactionAnalytics?.data?.escrowStatusBreakdown && Object.entries(stats.transactionAnalytics.data.escrowStatusBreakdown).map(([key, value]) => (
                          <tr key={key} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                            <td className="py-3 px-4 text-center capitalize">{key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</td>
                            <td className="py-3 px-4 text-center font-bold">{value as any}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </UITabsContent>
                </UITabs>
              </Card>
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
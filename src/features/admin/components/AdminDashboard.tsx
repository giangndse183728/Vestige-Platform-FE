"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  ShoppingBag, 
  FileText, 
  Settings, 
  BarChart3,
  Plus,
  Search,
  Tag,
  Briefcase,
  ChevronRight,
  Bell,
  User
} from "lucide-react";
import CategoryManager from "./CategoryManager";
import BrandManager from "./BrandManager";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

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
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "categories":
        return <CategoryManager />;
      case "brands":
        return <BrandManager />;
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {mockStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <stat.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <Badge variant={stat.change.startsWith('+') ? "success" : "destructive"}>
                        {stat.change}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <Card className="lg:col-span-2">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Button variant="link" className="text-blue-600 hover:text-blue-700">
                      View All
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockRecentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6 text-sm text-gray-900">{order.id}</td>
                          <td className="py-4 px-6 text-sm text-gray-900">{order.customer}</td>
                          <td className="py-4 px-6 text-sm text-gray-900">{order.product}</td>
                          <td className="py-4 px-6 text-sm text-gray-900">{order.amount}</td>
                          <td className="py-4 px-6">
                            <Badge
                              variant={
                                order.status === "Completed" ? "success" :
                                order.status === "Processing" ? "default" :
                                order.status === "Shipped" ? "secondary" :
                                "warning"
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card>
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { icon: Users, label: "Manage Users", color: "bg-blue-50 text-blue-600" },
                    { icon: ShoppingBag, label: "Manage Products", color: "bg-green-50 text-green-600" },
                    { icon: FileText, label: "View Reports", color: "bg-purple-50 text-purple-600" },
                    { icon: Settings, label: "Settings", color: "bg-yellow-50 text-yellow-600" },
                  ].map((action) => (
                    <Button
                      key={action.label}
                      variant="ghost"
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{action.label}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
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
              <Link href="/" className="group">
                <h1 className="font-metal text-3xl tracking-wider uppercase inline-block relative">
                  <span className="text-black">VES</span>
                  <span className="text-red-900">TIGE</span>
                  <span className="absolute -top-1 -right-1 text-red-900 text-[8px]">®</span>
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
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
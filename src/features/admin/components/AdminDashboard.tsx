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
  Briefcase
} from "lucide-react";
import CategoryManager from "./CategoryManager";
import BrandManager from "./BrandManager";

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
                  className="bg-white/80 backdrop-blur-sm border border-black/10 p-6 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#660000]/5 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="h-6 w-6 text-[#660000]" />
                      <span className="text-sm font-gothic text-green-600">{stat.change}</span>
                    </div>
                    <h3 className="text-2xl font-gothic mb-1">{stat.value}</h3>
                    <p className="text-sm text-black/60">{stat.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-black/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-gothic text-xl">Recent Orders</h2>
                  <button className="text-sm text-[#660000] hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-black/10">
                        <th className="text-left py-3 px-4 font-gothic text-sm">Order ID</th>
                        <th className="text-left py-3 px-4 font-gothic text-sm">Customer</th>
                        <th className="text-left py-3 px-4 font-gothic text-sm">Product</th>
                        <th className="text-left py-3 px-4 font-gothic text-sm">Amount</th>
                        <th className="text-left py-3 px-4 font-gothic text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRecentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-black/5 hover:bg-black/5">
                          <td className="py-3 px-4 text-sm">{order.id}</td>
                          <td className="py-3 px-4 text-sm">{order.customer}</td>
                          <td className="py-3 px-4 text-sm">{order.product}</td>
                          <td className="py-3 px-4 text-sm">{order.amount}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              order.status === "Completed" ? "bg-green-100 text-green-800" :
                              order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                              order.status === "Shipped" ? "bg-purple-100 text-purple-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm border border-black/10 p-6">
                <h2 className="font-gothic text-xl mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  {[
                    { icon: Users, label: "Manage Users", color: "bg-blue-100 text-blue-800" },
                    { icon: ShoppingBag, label: "Manage Products", color: "bg-green-100 text-green-800" },
                    { icon: FileText, label: "View Reports", color: "bg-purple-100 text-purple-800" },
                    { icon: Settings, label: "Settings", color: "bg-yellow-100 text-yellow-800" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="font-gothic text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-metal text-4xl tracking-wider mb-2">Admin Dashboard</h1>
            <div className="w-16 h-[1px] bg-[#660000]"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
              <input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-black/20 text-black placeholder-black/60 focus:outline-none focus:border-black/40"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-[#660000] transition-colors">
              <Plus className="h-4 w-4" />
              <span className="font-gothic text-sm">New Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-black/10">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-gothic transition-colors ${
                activeTab === tab.id
                  ? "border-[#660000] text-[#660000]"
                  : "border-transparent text-black/60 hover:text-black/80"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
} 
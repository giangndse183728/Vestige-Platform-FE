import { generateSEOMetadata } from "@/libs/seo";
import AdminDashboard from "@/features/admin/components/AdminDashboard";

export const metadata = generateSEOMetadata({
  title: "Admin Dashboard | VESTIGE",
  description: "Admin dashboard for managing VESTIGE platform content and settings.",
  keywords: ["admin", "dashboard", "vestige", "management"],
  image: {
    url: "/banner.png",
    width: 1200,
    height: 630,
    alt: "Admin Dashboard"
  }
});

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <AdminDashboard />
      </main>
    </div>
  );
} 
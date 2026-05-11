import { LayoutGrid, Folder, ImageIcon, FileText } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatsCard";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";

export default function DashboardPage() {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <h1 className="mb-6 text-3xl font-semibold leading-tight text-[#2DBE6C] sm:mb-8 sm:text-4xl lg:mb-10 lg:text-[40px] lg:leading-[48px]">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Total Categories"
          value="5"
          icon={<LayoutGrid size={32} />}
        />

        <AdminStatCard
          title="Use Cases"
          value="10"
          icon={<Folder size={32} />}
        />

        <AdminStatCard
          title="Gallery Photos"
          value="24"
          icon={<ImageIcon size={32} />}
        />

        <AdminStatCard
          title="Blogs"
          value="15"
          icon={<FileText size={32} />}
        />
      </div>

      <div className="mt-6 sm:mt-8">
        <AdminRecentActivity />
      </div>
    </div>
  );
}
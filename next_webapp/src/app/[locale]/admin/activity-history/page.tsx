"use client";

interface ActivityEntry {
  id: number;
  activity: string;
  performedBy: string;
  performedAt: string;
}

// TODO: Replace with real data from API endpoint (e.g. GET /api/admin/activity-history)
const activityData: ActivityEntry[] = [
  {
    id: 1,
    activity: "Created new category: Urban Planning",
    performedBy: "admin@mop.com",
    performedAt: "15 May 2026, 2:30 PM",
  },
  {
    id: 2,
    activity: "Updated use case: Smart Parking Sensors",
    performedBy: "sachin@mop.com",
    performedAt: "15 May 2026, 1:45 PM",
  },
  {
    id: 3,
    activity: "Published blog post: Pedestrian Counting Network",
    performedBy: "admin@mop.com",
    performedAt: "14 May 2026, 4:20 PM",
  },
  {
    id: 4,
    activity: "Deleted blog post: Draft - Old Transport Data",
    performedBy: "sachin@mop.com",
    performedAt: "14 May 2026, 11:10 AM",
  },
  {
    id: 5,
    activity: "Added new use case: Crime-Aware Cycling Planner",
    performedBy: "admin@mop.com",
    performedAt: "13 May 2026, 3:55 PM",
  },
  {
    id: 6,
    activity: "Updated category: Transport & Mobility",
    performedBy: "sachin@mop.com",
    performedAt: "13 May 2026, 10:30 AM",
  },
  {
    id: 7,
    activity: "Uploaded gallery image: Flinders Street Station",
    performedBy: "admin@mop.com",
    performedAt: "12 May 2026, 2:15 PM",
  },
  {
    id: 8,
    activity: "Created new blog post: Urban Forest Tree Data",
    performedBy: "sachin@mop.com",
    performedAt: "12 May 2026, 9:45 AM",
  },
  {
    id: 9,
    activity: "Updated user role: reviewer@mop.com to Editor",
    performedBy: "admin@mop.com",
    performedAt: "11 May 2026, 5:00 PM",
  },
  {
    id: 10,
    activity: "Deleted use case: Outdated Parking Analysis",
    performedBy: "sachin@mop.com",
    performedAt: "11 May 2026, 8:20 AM",
  },
];

export default function ActivityHistoryPage() {
  return (
    // ml offsets the absolute-positioned sidebar on mobile/tablet (120px open → 120-32=88px extra needed;
    // 180px on md → 180-32=148px). lg+ uses the flex-flow desktop sidebar so no offset needed.
    <div className="ml-[88px] md:ml-[148px] lg:ml-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[40px] font-semibold leading-[48px] text-[#2DBE6C]">
          Activity History
        </h1>
        <p className="mt-2 text-[16px] leading-[24px] text-[#687280]">
          Track all admin activities and changes
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#ECEAEA] p-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black/30">
                <th className="min-w-[250px] px-3 py-4 text-left text-[14px] font-semibold text-black">
                  Activity Performed
                </th>
                <th className="px-3 py-4 text-left text-[14px] font-semibold text-black">
                  Performed By
                </th>
                <th className="px-3 py-4 text-left text-[14px] font-semibold text-black">
                  Performed At
                </th>
              </tr>
            </thead>

            <tbody>
              {activityData.map((entry) => (
                <tr key={entry.id} className="border-b border-black/10">
                  <td className="min-w-[250px] px-3 py-4 text-[14px] font-medium text-black">
                    {entry.activity}
                  </td>
                  <td className="px-3 py-4 text-[14px] text-[#687280]">
                    {entry.performedBy}
                  </td>
                  <td className="px-3 py-4 text-[14px] text-[#687280]">
                    {entry.performedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

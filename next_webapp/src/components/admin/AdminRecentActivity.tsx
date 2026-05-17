"use client";

import { useEffect, useState } from "react";

interface ActivityEntry {
  id: number;
  activity: string;
  performedBy: string;
  performedAt: string;
}

function authHeaders(): Record<string, string> {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token: string = user.token ?? "";

  return {
    "x-user-id": String(user.userId ?? user.id ?? ""),
    "x-user-role-id": String(user.roleId ?? user.role_id ?? ""),
    "x-user-role": user.roleName ?? user.role_name ?? "",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AdminRecentActivity() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/activity-history?pageSize=5", {
      headers: authHeaders(),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setEntries(json.data || []);
        }
      })
      .catch(() => {
        setEntries([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="mt-8 w-full md:mt-10">
      <h2 className="mb-4 text-2xl font-semibold leading-tight text-[#2DBE6C] sm:text-3xl md:text-[28px]">
        Recent Activity
      </h2>

      <div className="w-full rounded-2xl bg-[#ECEAEA] p-3 shadow-sm sm:p-5 md:p-6">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-black/40">
                <th className="whitespace-nowrap px-3 py-3 text-left text-[13px] font-semibold text-black sm:text-sm">
                  Date
                </th>
                <th className="whitespace-nowrap px-3 py-3 text-left text-[13px] font-semibold text-black sm:text-sm">
                  Activity
                </th>
                <th className="whitespace-nowrap px-3 py-3 text-left text-[13px] font-semibold text-black sm:text-sm">
                  Performed By
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-8 text-center text-sm text-gray-500"
                  >
                    Loading recent activity...
                  </td>
                </tr>
              ) : entries.length > 0 ? (
                entries.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-300 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-3 py-4 text-[13px] text-black sm:text-sm">
                      {formatTime(item.performedAt)}
                    </td>

                    <td className="px-3 py-4 text-[13px] text-black sm:text-sm">
                      {item.activity}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-[13px] text-black sm:text-sm">
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {item.performedBy || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-8 text-center text-sm text-gray-500"
                  >
                    No recent activity available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
const activityData = [
  { date: "02/04/2026 07:00", activity: "Blog Added", status: "Published" },
  {
    date: "01/04/2026 16:00",
    activity: "New category created",
    status: "Published",
  },
  {
    date: "01/04/2026 12:00",
    activity: "New category created",
    status: "Pending",
  },
];

export default function AdminRecentActivity() {
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
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {activityData.map((item, index) => (
                <tr
                  key={`${item.date}-${index}`}
                  className="border-b border-gray-300 last:border-b-0"
                >
                  <td className="whitespace-nowrap px-3 py-4 text-[13px] text-black sm:text-sm">
                    {item.date}
                  </td>

                  <td className="px-3 py-4 text-[13px] text-black sm:text-sm">
                    {item.activity}
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-[13px] text-black sm:text-sm">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
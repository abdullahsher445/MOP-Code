export default function SettingsPage() {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold leading-tight text-[#2DBE6C] sm:text-4xl lg:text-[40px] lg:leading-[48px]">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#687280] sm:text-base">
          Manage admin dashboard settings, account preferences, and system
          configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-[#ECEAEA] p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-black">
            Account Settings
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#687280]">
            Update admin profile details and account preferences.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Admin Name
              </label>
              <input
                type="text"
                placeholder="Admin"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F8F50] focus:ring-2 focus:ring-[#1F8F50]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F8F50] focus:ring-2 focus:ring-[#1F8F50]/20"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-[#ECEAEA] p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-black">
            Dashboard Preferences
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#687280]">
            Control basic dashboard display and notification preferences.
          </p>

          <div className="mt-5 space-y-4">
            <label className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3">
              <span className="text-sm font-medium text-black">
                Email Notifications
              </span>
              <input type="checkbox" className="h-4 w-4 accent-[#1F8F50]" />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3">
              <span className="text-sm font-medium text-black">
                Activity Alerts
              </span>
              <input type="checkbox" className="h-4 w-4 accent-[#1F8F50]" />
            </label>
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          className="rounded-lg bg-[#1F8F50] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2DBE6C]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
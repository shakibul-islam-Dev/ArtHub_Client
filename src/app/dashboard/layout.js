import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardParentLayout = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 overflow-hidden transition-colors duration-300">
      {/* Sidebar - no extra padding/margins */}
      <div className="hidden md:flex lg:w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        <DashboardSideBar session={session} />
      </div>

      {/* Main Content Area - direct integration */}
      <main className="flex-1 h-full overflow-y-auto bg-neutral-50 dark:bg-neutral-950">
        <div className="w-full h-full p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default DashboardParentLayout;

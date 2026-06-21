import DashboardNavBar from "@/components/dashboard/DashboardNavBar";
import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardParentLayout = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - এটি স্থির থাকবে */}
      <DashboardSideBar session={session} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Navbar */}

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default DashboardParentLayout;

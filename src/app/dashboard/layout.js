import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardParentLayout = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden relative">
      <div className="md:block lg:w-64 shrink-0 z-50">
        <DashboardSideBar session={session} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full relative w-full">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardParentLayout;

import DashboardSideBar from "../../components/dashboard/DashboardSideBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardParentLayout = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <DashboardSideBar session={session} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardParentLayout;

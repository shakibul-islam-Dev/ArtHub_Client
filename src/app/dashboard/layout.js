import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardParentLayout = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 overflow-hidden transition-colors duration-300">
      {/* 🛠️ ফিক্সড র্যাপার: মোবাইলে এটি কোনো বাধা দেবে না, ডেক্সটপে ফিক্সড ৬৪ উইডথ ধরে রাখবে */}
      <div className="md:w-64 md:shrink-0 md:border-r md:border-neutral-200 md:dark:border-neutral-800 bg-white dark:bg-black">
        <DashboardSideBar session={session} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-neutral-50 dark:bg-neutral-950 pt-16 md:pt-0">
        <div className="w-full h-full p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default DashboardParentLayout;

import { Bell, Envelope, House, Magnifier, ChartPie } from "@gravity-ui/icons";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // আপনার প্রজেক্টের Better Auth সার্ভার ইনস্ট্যান্স
import MobileDrawer from "@/components/MobileDrawer";

export default async function DashboardSideBar() {
  // সার্ভার সাইড সেশন মেথড
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session?.user?.role || "user";

  const dashboardItems = {
    user: [
      {
        icon: House,
        label: "Bought Artworks",
        href: `/dashboard/user/bought-artworks`,
      },
      {
        icon: Magnifier,
        label: "Purchased History",
        href: `/dashboard/user/purchased-history`,
      },
      {
        icon: Magnifier,
        label: "Subscriptions",
        href: `/dashboard/user/subscriptions`,
      },
      {
        icon: Envelope,
        label: "Profile",
        href: `/dashboard/user/profile`,
      },
    ],
    artist: [
      {
        icon: ChartPie,
        label: "Art Works",
        href: `/dashboard/artist/artworks`, // herf -> href ঠিক করা হয়েছে
      },
      {
        icon: Magnifier,
        label: "Manage Artworks",
        href: `/dashboard/artist/add-artwork`, // herf -> href ঠিক করা হয়েছে
      },
      {
        icon: Bell,
        label: "Sales History",
        href: `/dashboard/artist/sales-history`, // herf -> href এবং ডুপ্লিকেট রিমুভড
      },
      {
        icon: Envelope,
        label: "Profile",
        href: `/dashboard/artist/profile`,
      },
    ],
    admin: [
      {
        icon: ChartPie,
        label: "Analytics",
        href: `/dashboard/admin/analytics`,
      },
      {
        icon: House,
        label: "ArtWorks",
        href: `/dashboard/admin/artworks`,
      },
      {
        icon: House,
        label: "Transactions",
        href: `/dashboard/admin/transactions`,
      },
      {
        icon: House,
        label: "Users",
        href: `/dashboard/admin/users`,
      },
      {
        icon: Magnifier,
        label: "Approve Artworks",
        href: `/dashboard/admin/artworks`,
      },
    ],
  };

  const currentNavItems = dashboardItems[role] || dashboardItems["user"];

  // প্লেইন ডেটা অবজেক্ট তৈরি করা যা মোবাইল ড্রয়ারে পাস করা যাবে
  const serializableNavItems = currentNavItems.map((item) => ({
    label: item.label,
    href: item.href,
  }));

  // ডেস্কটপ নেভিগেশন ভিউ
  const desktopNavContents = (
    <nav className="flex flex-col gap-1.5 mt-2">
      {currentNavItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link
            key={`${item.label}-${index}`} // ডুপ্লিকেট কি এরর এড়াতে ইনডেক্স সহ ইউনিক কি
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <Icon className="size-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-gray-200 p-4 h-screen sticky top-0 bg-white">
        <h2 className="text-xl font-bold p-2 mb-4 capitalize text-gray-800 border-b border-gray-100 pb-4">
          {role} Dashboard
        </h2>
        {desktopNavContents}
      </aside>

      {/* ================= MOBILE MENUBAR (সার্ভার রেন্ডারড) ================= */}
      <div className="md:hidden w-full bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
        <h2 className="text-lg font-bold capitalize text-gray-800">
          {role} Dashboard
        </h2>

        {/* ড্রয়ারের পার্টটুকু আলাদা ক্লায়েন্ট ফাইলে পাঠানো হলো */}
        <MobileDrawer role={role} navItems={serializableNavItems} />
      </div>
    </>
  );
}

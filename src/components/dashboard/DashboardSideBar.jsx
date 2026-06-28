"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import {
  Menu,
  X,
  Home,
  Image as ImageIcon,
  History,
  User,
  PlusCircle,
  FolderEdit,
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

export default function DashboardSideBar({ session: initialSession }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dbUserImage, setDbUserImage] = useState(null);
  const [dbUserName, setDbUserName] = useState(null);
  const [dbUserPlan, setDbUserPlan] = useState("Free");
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const { data: updatedSession } = authClient.useSession();
  const currentSession = updatedSession || initialSession;

  const rawRole = currentSession?.user?.role || "user";
  const role = rawRole.toLowerCase();

  useEffect(() => {
    const fetchLatestUserData = async () => {
      if (!currentSession?.user?.id || !currentSession?.user?.email) return;

      const baseUrl = process.env.NEXT_PUBLIC_URL;

      try {
        const { data: tokenData, error: tokenError } = await authClient.token();

        if (tokenError || !tokenData?.token) {
          console.error("Failed to fetch auth token on sidebar:", tokenError);
          return;
        }

        const jwtToken = tokenData.token;

        const userRes = await fetch(
          `${baseUrl}/api/arthub/user/${currentSession.user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              Authorization: `Bearer ${jwtToken}`,
            },
          },
        );
        if (userRes.ok) {
          const data = await userRes.json();
          const userData = data?.success ? data.data : data;

          const fetchedImage =
            userData?.image_url || userData?.imageUrl || userData?.image;
          setDbUserImage(fetchedImage);

          const fetchedName = userData?.name || userData?.username;
          if (fetchedName) setDbUserName(fetchedName);
        }

        if (role === "artist" || role === "admin") {
          setDbUserPlan(role);
          return;
        }

        const subRes = await fetch(
          `${baseUrl}/api/arthub/subscriptions/${currentSession.user.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              Authorization: `Bearer ${jwtToken}`,
            },
          },
        );
        if (subRes.ok) {
          const subData = await subRes.json();
          if (subData?.success && subData?.data?.status === "complete") {
            setDbUserPlan(subData.data.planName || "Free");
          } else {
            setDbUserPlan("Free");
          }
        } else {
          setDbUserPlan("Free");
        }
      } catch (error) {
        console.error("Error fetching latest user data on sidebar:", error);
      }
    };

    fetchLatestUserData();
  }, [currentSession?.user?.id, currentSession?.user?.email, pathname, role]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const userName = dbUserName || currentSession?.user?.name || "User";

  const userImage =
    dbUserImage ||
    currentSession?.user?.image_url ||
    currentSession?.user?.imageUrl ||
    currentSession?.user?.image;

  const userPlan = dbUserPlan;

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const mobileNavLabels = {
    user: [
      { label: "Home", href: "/dashboard/user", icon: Home },
      {
        label: "Bought Artworks",
        href: "/dashboard/user/bought-artworks",
        icon: ImageIcon,
      },
      {
        label: "Purchased History",
        href: "/dashboard/user/purchased-history",
        icon: History,
      },
      { label: "Profile", href: "/settings", icon: User },
    ],
    artist: [
      { label: "Home", href: "/dashboard/artist", icon: Home },
      {
        label: "Manage Artworks",
        href: "/dashboard/artist/artworks",
        icon: FolderEdit,
      },
      {
        label: "Add Arts",
        href: "/dashboard/artist/add-artworks",
        icon: PlusCircle,
      },
      {
        label: "Sales History",
        href: "/dashboard/artist/sales-history",
        icon: TrendingUp,
      },
    ],
    admin: [
      { label: "Home", href: "/dashboard/admin", icon: Home },
      {
        label: "Analytics",
        href: "/dashboard/admin/analytics",
        icon: BarChart3,
      },
      { label: "ArtWorks", href: "/dashboard/admin/artworks", icon: ImageIcon },
      {
        label: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: DollarSign,
      },
      { label: "Users", href: "/dashboard/admin/users", icon: Users },
    ],
  };

  const serializableNavItems = mobileNavLabels[role] || mobileNavLabels["user"];

  const checkActiveState = (itemHref) => {
    if (itemHref === "/dashboard/artist/artworks/id") {
      return (
        pathname.startsWith("/dashboard/artist/artworks/") &&
        pathname !== "/dashboard/artist/artworks"
      );
    }
    return pathname === itemHref;
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const firstLetter = (userName || "U").charAt(0);

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border p-4 h-screen sticky top-0 bg-background text-foreground transition-colors duration-300 select-none justify-between">
        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between p-2 border-b border-border/50 pb-4">
            <Link
              href="/"
              className="flex items-center gap-3 min-w-0 hover:opacity-85 transition-opacity cursor-pointer"
            >
              {userImage ? (
                <div className="w-10 h-10 shrink-0 relative">
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-full h-full rounded-full object-cover ring-2 ring-border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground uppercase shrink-0">
                  {firstLetter}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate">
                  {userName}
                </span>
                <span className="text-xs opacity-70 truncate capitalize">
                  {role} •{" "}
                  <span className="text-primary font-medium tracking-wide uppercase text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">
                    {userPlan}
                  </span>
                </span>
              </div>
            </Link>

            <button
              onClick={toggleTheme}
              className="w-9 h-9 border border-border rounded-lg flex items-center justify-center bg-transparent text-foreground hover:bg-muted relative shrink-0"
              title="Toggle theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {serializableNavItems.map((item, index) => {
              const isActive = checkActiveState(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={`desktop-${item.href}-${index}`}
                  href={item.href}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-accent-foreground"
                        : "text-muted-foreground"
                    }
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MOBILE HEADER TOP BAR ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-md border-b border-border px-4 flex items-center justify-between z-40 transition-colors duration-300">
        <h2 className="text-md font-bold capitalize">{role} Dashboard</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 border border-border rounded-lg flex items-center justify-center bg-transparent text-foreground hover:bg-muted relative"
            title="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-muted-foreground hover:text-foreground focus:outline-none rounded-md hover:bg-muted"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className="w-full h-16 md:hidden block shrink-0" />

      {/* ================= MOBILE DRAWER BACKDROP OVERLAY ================= */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* ================= MOBILE SLIDING SIDEBAR DRAWER ================= */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-background text-foreground z-50 p-6 shadow-xl flex flex-col md:hidden transition-transform duration-300 ease-in-out justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center pb-4 border-b border-border/50">
            <Link
              href="/"
              className="flex items-center gap-3 min-w-0 hover:opacity-85 transition-opacity cursor-pointer"
            >
              {userImage ? (
                <div className="w-9 h-9 shrink-0 relative">
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-full h-full rounded-full object-cover ring-1 ring-border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground uppercase text-sm shrink-0">
                  {firstLetter}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate">
                  {userName}
                </span>
                <span className="text-xs opacity-70 capitalize">
                  {role} •{" "}
                  <span className="text-primary font-bold uppercase text-[9px] bg-primary/10 px-1 rounded">
                    {userPlan}
                  </span>
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {serializableNavItems.map((item, index) => {
              const isActive = checkActiveState(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={`mobile-${item.href}-${index}`}
                  href={item.href}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-accent-foreground"
                        : "text-muted-foreground"
                    }
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

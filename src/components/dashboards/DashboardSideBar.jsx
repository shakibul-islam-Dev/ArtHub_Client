"use client";
import {
  Bars,
  Bell,
  Envelope,
  Gear,
  House,
  Magnifier,
  Person,
} from "@gravity-ui/icons";
import {
  Button,
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerDialog,
  DrawerCloseTrigger,
  DrawerHeader,
  DrawerHeading,
  DrawerBody,
} from "@heroui/react";
import Link from "next/link";

export default function DashboardSideBar() {
  const navItems = [
    { icon: House, label: "Home", href: "/dashboard/artist" },
    {
      icon: Magnifier,
      label: "Manage Artworks",
      href: "/dashboard/artist/manage-artworks",
    },
    {
      icon: Bell,
      label: "Sales History",
      href: "/dashboard/artist/sales-history",
    },
    {
      icon: Envelope,
      label: "Profile Manager",
      href: "/dashboard/artist/profile",
    },
  ];
  const navContents = (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-default transition-colors"
        >
          <item.icon className="size-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* ১. বড় স্ক্রিনের জন্য ফিক্সড সাইডবার (hidden on mobile, md:flex) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-default p-4 lg:block">
        <h2 className="text-xl font-bold p-2 mb-4">Dashboard</h2>
        {navContents}
      </aside>

      {/* ২. ছোট স্ক্রিনের জন্য ড্রয়ার বাটন (visible on mobile, md:hidden) */}
      <div className="md:hidden p-4">
        <Drawer>
          <Button variant="secondary" asChild>
            <Bars className="size-6" />
          </Button>
          <DrawerBackdrop>
            <DrawerContent placement="left">
              <DrawerDialog>
                <DrawerCloseTrigger />
                <DrawerHeader>
                  <DrawerHeading>Dashboard</DrawerHeading>
                </DrawerHeader>
                <DrawerBody>{navContents}</DrawerBody>
              </DrawerDialog>
            </DrawerContent>
          </DrawerBackdrop>
        </Drawer>
      </div>
    </>
  );
}

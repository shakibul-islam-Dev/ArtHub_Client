"use client";
import { Bars, Bell, Envelope, House, Magnifier } from "@gravity-ui/icons";
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
import { useSession } from "@/lib/auth-client";

export default function DashboardSideBar() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const navItems = [
    { icon: House, label: "Home", href: `/dashboard/${role}` },
    {
      icon: Magnifier,
      label: "Manage Artworks",
      href: `/dashboard/${role}/manage-artworks`,
    },
    {
      icon: Bell,
      label: "Sales History",
      href: `/dashboard/${role}/sales-history`,
    },
    {
      icon: Envelope,
      label: "Profile",
      href: `/dashboard/${role}/profile`,
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
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-default p-4 lg:block">
        <h2 className="text-xl font-bold p-2 mb-4 capitalize">
          {role} Dashboard
        </h2>
        {navContents}
      </aside>

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
                  <DrawerHeading className="capitalize">
                    {role} Dashboard
                  </DrawerHeading>
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

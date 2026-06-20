"use client";
import React from "react";
import Link from "next/link";
import {
  Bars,
  Bell,
  Envelope,
  House,
  Magnifier,
  ChartPie,
} from "@gravity-ui/icons";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/react";

// আইকন ম্যাপ করার অবজেক্ট
const iconMap = {
  Overview: ChartPie,
  Dashboard: House,
  "Browse Artworks": Magnifier,
  "Manage Artworks": Magnifier,
  "Approve Artworks": Magnifier,
  "Manage Users": House,
  "My Orders": Bell,
  "Sales History": Bell,
  Profile: Envelope,
  Settings: Envelope,
};

export default function MobileDrawer({ role, navItems }) {
  return (
    <Drawer placement="left" size="xs">
      <Button isIconOnly variant="light" className="text-gray-600">
        <Bars className="size-6" />
      </Button>
      <DrawerContent className="bg-white">
        <DrawerHeader className="border-b border-gray-100 px-4 py-4">
          <span className="text-lg font-bold capitalize text-gray-800">
            {role} Menu
          </span>
        </DrawerHeader>
        <DrawerBody className="px-2 py-4">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = iconMap[item.label] || House; // লেবেল অনুযায়ী সঠিক আইকন সিলেক্ট
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <Icon className="size-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

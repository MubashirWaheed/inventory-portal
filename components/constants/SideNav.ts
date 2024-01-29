import { LayoutDashboard, ListTodo, Users, Settings } from "lucide-react";

import { type NavItem } from "@/types/SideNav";

export const NavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },

  {
    title: "Categories",
    icon: ListTodo,
    href: "/categories",
    color: "text-orange-500",
    isChidren: true,
    children: [
      {
        title: "Oil-Filters",
        icon: ListTodo,
        color: "text-red-500",
        href: "/categories/1",
      },
      {
        title: "Air Filters",
        icon: ListTodo,
        color: "text-green-500",
        href: "/categories/2",
      },
      {
        title: "Oils",
        icon: ListTodo,
        color: "text-blue-500",
        href: "/categories/3",
      },
      {
        title: "Cleaning Items",
        icon: ListTodo,
        color: "text-blue-500",
        href: "/categories/4",
      },
      {
        title: "Miscellaneous Items",
        icon: ListTodo,
        color: "text-blue-500",
        href: "/categories/5",
      },
      {
        title: "Sillion",
        icon: ListTodo,
        color: "text-blue-500",
        href: "/categories/6",
      },
      {
        title: "Gear Oil",
        icon: ListTodo,
        color: "text-blue-500",
        href: "/categories/7",
      },
      {
        title: "Coolants",
        icon: ListTodo,
        color: "text-blue-500",
        href: "/categories/8",
      },
      {
        title: "Spray",
        icon: ListTodo,
        color: "text-blue-500",
        href: "/categories/9",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-sky-500",
  },
];

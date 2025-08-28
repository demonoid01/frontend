"use client";

import {
  Archive,
  ChevronDown,
  ChevronUp,
  FileBox,
  Home,
  PackageOpenIcon,
  PenToolIcon,
  Settings,
  ShoppingCart,
  Users,
  Upload,

} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    subItems: [
      { title: "User List", url: "/admin/users/" },
      { title: "Create User", url: "/admin/users/create" },
    ],
  },
  {
    title: "Image Uplord",
    url: "/admin/imageUplord",
    icon: Upload,
    subItems: [
      { title: "Uplord Image", url: "/admin/imageUplord" },
      // { title: "List Image", url: "/admin/ImageAdd" },
    ],
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: PackageOpenIcon,
    subItems: [
      { title: "Categories List", url: "/admin/categories" },
      { title: "Add Category", url: "/admin/categories/add" },
      { title: "Manage Fields", url: "/admin/categories/fields" },
    ],
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: FileBox,
    subItems: [
      { title: "Product List", url: "/admin/products" },
      { title: "Add Product", url: "/admin/products/add" },
    ],
  },
  {
    title: "Video",
    url: "/admin/heroVideos",
    icon: FileBox,
    subItems: [
      // { title: "Product List", url: "/admin/products" },
      { title: "Add Video", url: "/admin/heroVideos/add" },
    ],
  },
  {
    title: "Home Installation",
    url: "/admin/home-installation",
    icon: PenToolIcon,
    subItems: [
      { title: "Show All", url: "/admin/home-installation" },
      { title: "Requested", url: "/admin/home-installation/requested" },
      { title: "Cancelled", url: "/admin/home-installation/cancelled" },
      { title: "Completed", url: "/admin/home-installation/completed" },
    ],
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
    subItems: [
      { title: "Order List", url: "/admin/orders/list" },
      { title: "Create Order", url: "/admin/orders/create" },
    ],
  },
  {
    title: "Inventory",
    url: "/admin/inventory",
    icon: Archive,
    subItems: [
      { title: "Inventory List", url: "/admin/inventory/list" },
      { title: "Update Inventory", url: "/admin/inventory/update" },
    ],
  },
  // {
  //   title: "Reviews",
  //   url: "/admin/reviews",
  //   icon: Star,
  // },
  // {
  //   title: "Discounts",
  //   url: "/admin/discounts",
  //   icon: Tag,
  //   subItems: [
  //     { title: "Discount List", url: "/admin/discounts/list" },
  //     { title: "Add Discount", url: "/admin/discounts/add" },
  //   ],
  // },
  // {
  //   title: "Reports",
  //   url: "/admin/reports",
  //   icon: BarChart,
  //   subItems: [
  //     { title: "Sales Report", url: "/admin/reports/sales" },
  //     { title: "User Activity", url: "/admin/reports/user-activity" },
  //     { title: "Inventory Report", url: "/admin/reports/inventory" },
  //   ],
  // },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    subItems: [
      { title: "General Settings", url: "/admin/settings/general" },
      { title: "User Roles", url: "/admin/settings/user-roles" },
    ],
  },
];

export function AppSidebar() {

  return (
    <Sidebar className="bg-black">
      <SidebarContent className="bg-black text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white text-xl my-4 gap-4 flex items-center">
            <Link href={"/admin/dashboard"}>
              <Image
                src="/LOGO.png"
                alt="logo"
                width={40}
                height={40}
                className=""
                loading="eager"
              />
            </Link>
            Demoniod
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 mt-8 overflow-x-hidden">
              {items.map((item) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex items-center justify-between py-6 relative">
                        <div className="flex items-center gap-2 w-full">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>

                        {item.subItems ? (
                          <>
                            <ChevronDown className="group-open:hidden" />
                            <ChevronUp className="hidden group-open:block" />
                          </>
                        ) : (
                          <Link
                            href={item.url}
                            className="ml-auto w-full h-full absolute z-10"
                          ></Link>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>

                  {item.subItems && (
                    <CollapsibleContent>
                      <SidebarMenu className="ml-6 space-y-2">
                        {item.subItems.map((subItem) => (
                          <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

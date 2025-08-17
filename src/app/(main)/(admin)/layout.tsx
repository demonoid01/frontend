"use client";
import {
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BellRingIcon, LogOut, UserCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <main className="w-full p-6 relative">
        <div className="absolute top-6 right-6 pr-4">
          {/* <AdminNotifications /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="flex items-center gap-2 py-6 bg-black px-4">
                <UserCircle2 size={25} /> {"Admin"}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-48 mr-10 bg-black text-white"
            >
              <DropdownMenuItem>
                {" "}
                <Link
                  href={"/admin/notification"}
                  className="py-3 cursor-pointer flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <BellRingIcon size={16} /> Notifications
                  </div>
                  <span className="bg-red-600 p-1 rounded-full px-2 scale-75 absolute right-1">
                    10
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await api.post("/auth/logout");
                  router.replace("/auth/login");
                }}
                className="py-3 cursor-pointer"
              >
                {" "}
                <LogOut /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider >
  );
}
